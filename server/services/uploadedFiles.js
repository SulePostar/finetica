const { UploadedFile, User, KifProcessingLog} = require('../models');
const { Op } = require('sequelize');
const supabaseService = require('../utils/supabase/supabaseService');
const AppError = require('../utils/errorHandler');
const { extractKifData, createKifFromAI } = require('./kif');

class UploadedFilesService {
  /**
   * Get allowed buckets for file uploads
   * @returns {Array<string>} Array of allowed bucket names
   */
  getAllowedBuckets() {
    return ['kif', 'kuf', 'transactions', 'contracts', 'user-images'];
  }

  /**
   * Validate bucket name
   * @param {string} bucketName - Bucket name to validate
   * @returns {Object} Validation result
   */
  validateBucket(bucketName) {
    const allowedBuckets = this.getAllowedBuckets();

    if (!bucketName) {
      return {
        isValid: false,
        error: 'Bucket name is required',
      };
    }

    if (!allowedBuckets.includes(bucketName)) {
      return {
        isValid: false,
        error: `Invalid bucket name. Allowed buckets: ${allowedBuckets.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Prepare file data from request body and user info
   * @param {Object} requestBody - Request body containing file data
   * @param {number} userId - ID of the user uploading the file
   * @returns {Object} Prepared file data
   */
  prepareFileData(requestBody, userId) {
    return {
      ...requestBody,
      uploadedBy: userId,
    };
  }

  /**
   * Create a new file record in the database
   * @param {Object} fileData - File data object
  * @param {string} fileData.fileName - File name in storage
  * @param {string} fileData.fileUrl - Full URL to the file
  * @param {number} fileData.fileSize - File size in bytes
  * @param {string} fileData.mimeType - MIME type of the file
  * @param {string} fileData.bucketName - Storage bucket name
  * @param {number} fileData.uploadedBy - User ID who uploaded the file
   * @param {string} fileData.description - Optional description
   * @returns {Promise<Object>} Created file record
   */
  async createFileRecord(fileData) {
    try {
      const fileRecord = await UploadedFile.create(fileData);
      return fileRecord;
    } catch (error) {
      throw new AppError(`Failed to create file record: ${error.message}`, 500);
    }
  }

  /**
   * Parse and validate query parameters for file listing
   * @param {Object} query - Raw query parameters from request
   * @returns {Object} Parsed and validated options
   */
  parseFileQuery(query) {
    return {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      uploaded_by: query.uploaded_by,
      bucket_name: query.bucket_name,
      is_active: query.is_active !== undefined ? query.is_active === 'true' : true,
      search: query.search,
    };
  }

  /**
   * Get all files with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @param {number} options.uploaded_by - Filter by user ID
   * @param {string} options.bucket_name - Filter by bucket
   * @param {boolean} options.is_active - Filter by active status
   * @param {string} options.search - Search in file names
   * @returns {Promise<Object>} Paginated file records
   */
  async getFiles(options = {}) {
    try {
      const { page = 1, limit = 10, uploaded_by, bucket_name, is_active = true, search } = options;

      const offset = (page - 1) * limit;
      const where = { is_active };

      // Add filters
      if (uploaded_by) {
        where.uploadedBy = uploaded_by;
      }

      if (bucket_name) {
        where.bucketName = bucket_name;
      }

      if (search) {
        where[Op.or] = [
          { file_name: { [Op.iLike]: `%${search}%` } },
          { original_name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await UploadedFile.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'uploader',
            attributes: ['id', 'email', 'first_name', 'last_name'],
          },
        ],
        order: [['created_at', 'DESC']], // relies on underscored timestamps mapping
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        files: rows,
        totalFiles: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }

  /**
   * Handle complete profile image upload process
   * @param {Object} file - Multer file object
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @returns {Promise<Object>} Upload result with formatted response
   */
  async uploadProfileImage(file, firstName, lastName) {
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required for profile image upload', 400);
    }
    const uploadResult = await supabaseService.uploadProfileImage(file, firstName, lastName);
    if (!uploadResult.success) {
      throw new Error(`Profile image upload failed: ${uploadResult.error}`);
    }
    return {
      success: true,
      data: {
        imageUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
      },
    };
  }

  /**
 * Process document based on bucket type with unified approach
 * @param {Buffer} fileBuffer - File buffer for processing
 * @param {string} mimeType - MIME type of the file
 * @param {string} bucketName - Storage bucket name
 * @param {string} filename - Name of the uploaded file
 * @returns {Promise<Object>} Processing result
 */
  async processDocumentByType(fileBuffer, mimeType, bucketName, filename) {
    let processingLog = null;
    let LogModel = null;

    try {
      // Determine the processing log model based on bucket type
      switch (bucketName) {
        case 'kif':
          LogModel = KifProcessingLog;
          break;
        case 'contracts':
          // TODO: Add ContractProcessingLog when it exists
          LogModel = null;
          break;
        case 'kuf':
          // TODO: Add KufProcessingLog when it exists
          LogModel = null;
          break;
        default:
          // No processing needed for other bucket types
          return {
            success: true,
            message: `No processing required for bucket: ${bucketName}`,
          };
      }
      // Create processing log entry if model exists
      if (LogModel) {
        processingLog = await LogModel.create({
          filename: filename,
          isProcessed: false,
          processedAt: null,
          message: 'Processing started'
        });
      }
      // Process document based on bucket type
      let result;
      switch (bucketName) {
        case 'kif':
          // Use individual KIF methods from kif.js
          const kifExtractedData = await extractKifData(fileBuffer, mimeType);
          const kifInvoice = await createKifFromAI(kifExtractedData);
          result = {
            success: true,
            data: kifInvoice
          };
          break;

        case 'kuf':
          throw new AppError('KUF processing not implemented yet', 501);
          break;  

        case 'contracts':
          // TODO: Add contract processing when it exists
          throw new AppError('Contract processing not implemented yet', 501);
          break;

        default:
          throw new AppError(`Unsupported document type: ${bucketName}`, 400);
      }
      // Update processing log as successful if it exists
      if (processingLog) {
        await processingLog.update({
          isProcessed: true,
          processedAt: new Date(),
          message: 'Processed successfully'
        });
      }
      return {
        success: true,
        data: result.data,
        processingLogId: processingLog?.id || null,
      };
    } catch (error) {
      console.error(`${bucketName.toUpperCase()} processing failed:`, error);
      // Update processing log with error if it exists
      if (processingLog) {
        try {
          await processingLog.update({
            isProcessed: false,
            processedAt: new Date(),
            message: `Error: ${error.message}`.slice(0, 1000)
          });
        } catch (updateError) {
          console.error(`Failed to update ${bucketName} processing log after error:`, updateError);
        }
      }
      // Throw error to prevent upload from continuing
      throw new AppError(`${bucketName.toUpperCase()} processing failed: ${error.message}`, 500);
    }
  }

  /**
   * Handle file upload with parallel processing for supported document types
   * @param {Object} file - Multer file object
   * @param {string} bucketName - Storage bucket name
   * @param {number} userId - ID of uploading user
   * @param {string} description - Optional file description
   * @returns {Promise<Object>} Upload result with processing result
   */
  async uploadFileWithProcessing(file, bucketName, userId, description = null) {
    // Validate PDF format for document types that require it
    const requiresPDF = ['kif', 'kuf', 'contracts'];
    if (requiresPDF.includes(bucketName) && file.mimetype !== 'application/pdf') {
      throw new AppError(`${bucketName.toUpperCase()} files must be PDF format`, 400);
    }
    // Start both operations in parallel
    const [uploadResult, processingResult] = await Promise.allSettled([
      // Upload to Supabase
      supabaseService.uploadFile(file, null, bucketName),
      // Process document based on bucket type
      this.processDocumentByType(file.buffer, file.mimetype, bucketName, file.originalname)
    ]);
    // Check processing result first - if it failed, don't proceed with file record creation
    if (processingResult.status === 'rejected') {
      // If upload succeeded but processing failed, we should clean up the uploaded file
      if (uploadResult.status === 'fulfilled' && uploadResult.value.success) {
        console.warn(`Processing failed for uploaded file: ${uploadResult.value.fileName}. Manual cleanup may be required.`);
      }
      // Re-throw the processing error
      throw processingResult.reason;
    }
    // Handle upload result
    if (uploadResult.status === 'rejected' || !uploadResult.value.success) {
      const error = uploadResult.status === 'rejected'
        ? uploadResult.reason
        : uploadResult.value.error;

      if (uploadResult.value?.code === 'DUPLICATE') {
        return {
          success: false,
          message: uploadResult.value.error,
        };
      }
      throw new Error(`Upload failed: ${error}`);
    }
    // Both operations succeeded - create file record in database
    const fileData = {
      fileName: uploadResult.value.fileName,
      fileUrl: uploadResult.value.publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      bucketName: bucketName,
      description: description,
    };
    const createdFile = await this.createFileRecord(fileData);

    return {
      success: true,
      data: createdFile,
      processing: processingResult.value,
    };
  }

  /**
   * Handle complete file upload process
   * @param {Object} file - Multer file object
   * @param {string} bucketName - Storage bucket name
   * @param {number} userId - ID of uploading user
   * @param {string} description - Optional file description
   * @returns {Promise<Object>} Upload result with database record
   */
  async uploadFile(file, bucketName, userId, description = null) {
    const bucketValidation = this.validateBucket(bucketName);
    if (!bucketValidation.isValid) {
      throw new AppError(bucketValidation.error, 400);
    }
    // Check if this bucket type requires processing
    const requiresProcessing = ['kif', 'kuf', 'contracts'].includes(bucketName);

    if (requiresProcessing) {
      // Use the unified processing upload method
      return await this.uploadFileWithProcessing(file, bucketName, userId, description);
    }
    // For buckets that don't require processing, use simple upload
    const uploadResult = await supabaseService.uploadFile(file, null, bucketName);
    if (!uploadResult.success) {
      if (uploadResult.code === 'DUPLICATE') {
        return {
          success: false,
          message: uploadResult.error,
        };
      }
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }
    // Create file record in database
    const fileData = {
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      bucketName: bucketName,
      description: description,
    };
    const createdFile = await this.createFileRecord(fileData);
    return {
      success: true,
      data: createdFile,
    };
  }
}

module.exports = new UploadedFilesService();
