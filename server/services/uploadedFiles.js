const { UploadedFile, User } = require('../models');
const { Op } = require('sequelize');
const supabaseService = require('../utils/supabase/supabaseService');
const AppError = require('../utils/errorHandler');

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
