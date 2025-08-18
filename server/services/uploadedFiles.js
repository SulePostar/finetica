const { UploadedFile, User } = require('../models');
const { Op } = require('sequelize');
const supabaseService = require('../utils/supabase/supabaseService');
const AppError = require('../utils/errorHandler');
const activityLogService = require('./activityLogService');

class UploadedFilesService {
  /**
   * Get allowed buckets for file uploads
   * @returns {Array<string>} Array of allowed bucket names
   */
  getAllowedBuckets() {
    return ['kif', 'kuf', 'transactions'];
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
      uploaded_by: userId,
    };
  }

  /**
   * Create a new file record in the database
   * @param {Object} fileData - File data object
   * @param {string} fileData.file_name - File name in storage
   * @param {string} fileData.file_url - Full URL to the file
   * @param {number} fileData.file_size - File size in bytes
   * @param {string} fileData.mime_type - MIME type of the file
   * @param {string} fileData.bucket_name - Storage bucket name
   * @param {number} fileData.uploaded_by - User ID who uploaded the file
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
   * Get file record by ID
   * @param {number} fileId - File ID
   * @returns {Promise<Object|null>} File record with uploader info
   */
  async getFileById(fileId) {
    try {
      const file = await UploadedFile.findByPk(fileId, {
        include: [
          {
            model: User,
            as: 'uploader',
            attributes: ['id', 'email', 'first_name', 'last_name'],
          },
        ],
      });
      return file;
    } catch (error) {
      throw new Error(`Failed to get file: ${error.message}`);
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
   * Parse options for user files query
   * @param {Object} query - Raw query parameters from request
   * @returns {Object} Parsed options
   */
  parseUserFilesQuery(query) {
    return {
      is_active: query.is_active !== undefined ? query.is_active === 'true' : true,
      limit: parseInt(query.limit) || 50,
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
        where.uploaded_by = uploaded_by;
      }

      if (bucket_name) {
        where.bucket_name = bucket_name;
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
        order: [['created_at', 'DESC']],
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
   * Sanitize update data by removing protected fields
   * @param {Object} updateData - Raw update data
   * @returns {Object} Sanitized update data
   */
  sanitizeUpdateData(updateData) {
    const sanitized = { ...updateData };

    // Remove fields that shouldn't be updated directly
    delete sanitized.id;
    delete sanitized.uploaded_by;
    delete sanitized.created_at;
    delete sanitized.updated_at;

    return sanitized;
  }

  /**
   * Update file record
   * @param {number} fileId - File ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated file record
   */
  async updateFile(fileId, updateData) {
    try {
      const file = await UploadedFile.findByPk(fileId);
      if (!file) {
        throw new AppError('File not found', 404);
      }

      // Sanitize the update data
      const sanitizedData = this.sanitizeUpdateData(updateData);

      await file.update(sanitizedData);
      return file;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to update file: ${error.message}`, 500);
    }
  }

  /**
   * Soft delete file record (mark as inactive)
   * @param {number} fileId - File ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(fileId) {
    try {
      const file = await UploadedFile.findByPk(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      await file.update({ is_active: false });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Hard delete file record (permanently remove from database)
   * @param {number} fileId - File ID
   * @returns {Promise<boolean>} Success status
   */
  async permanentDeleteFile(fileId) {
    try {
      const file = await UploadedFile.findByPk(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      await file.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to permanently delete file: ${error.message}`);
    }
  }

  /**
   * Get files by user ID
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's file records
   */
  async getFilesByUser(userId, options = {}) {
    try {
      const { is_active = true, limit = 50 } = options;

      const files = await UploadedFile.findAll({
        where: {
          uploaded_by: userId,
          is_active,
        },
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
      });

      return files;
    } catch (error) {
      throw new Error(`Failed to get user files: ${error.message}`);
    }
  }

  /**
   * Get file statistics
   * @returns {Promise<Object>} File statistics
   */
  async getFileStats() {
    try {
      const totalFiles = await UploadedFile.count({ where: { is_active: true } });
      const totalSize = await UploadedFile.sum('file_size', { where: { is_active: true } });

      const bucketStats = await UploadedFile.findAll({
        attributes: [
          'bucket_name',
          [UploadedFile.sequelize.fn('COUNT', UploadedFile.sequelize.col('id')), 'count'],
          [UploadedFile.sequelize.fn('SUM', UploadedFile.sequelize.col('file_size')), 'total_size'],
        ],
        where: { is_active: true },
        group: ['bucket_name'],
        raw: true,
      });

      return {
        totalFiles,
        totalSize: totalSize || 0,
        bucketStats,
      };
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error.message}`);
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
    // Validate required fields
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required for profile image upload', 400);
    }

    // Upload to Supabase storage
    const uploadResult = await supabaseService.uploadProfileImage(file, firstName, lastName);

    if (!uploadResult.success) {
      throw new Error(`Profile image upload failed: ${uploadResult.error}`);
    }

    // Return formatted response
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
    // Validate bucket
    const bucketValidation = this.validateBucket(bucketName);
    if (!bucketValidation.isValid) {
      throw new AppError(bucketValidation.error, 400);
    }

    // Upload to Supabase storage
    const uploadResult = await supabaseService.uploadFile(file, null, bucketName);

    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }

    // Create database record with proper field mapping
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

    // Log file upload activity
    await activityLogService.logActivity({
      userId: userId,
      action: 'upload',
      entity: 'UploadedFile',
      entityId: createdFile.id,
      details: {
        fileName: createdFile.fileName,
        bucketName: bucketName,
        fileSize: file.size,
        mimeType: file.mimetype,
        description: description,
      },
      status: 'success',
    });

    return {
      success: true,
      data: createdFile,
    };
  }

  /**
   * Delete file from both storage and database
   * @param {number} fileId - File ID to delete
   * @returns {Promise<Object>} Delete result
   */
  async deleteFileFromStorage(fileId) {
    // Get file record first
    const file = await this.getFileById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Delete from Supabase storage using the bucket name from the file record
    const deleteResult = await supabaseService.deleteFile(file.fileName, file.bucketName);

    if (!deleteResult.success) {
      throw new Error(`Storage deletion failed: ${deleteResult.error}`);
    }

    // Delete from database
    await this.deleteFile(fileId);

    // Log file deletion activity
    await activityLogService.logActivity({
      userId: file.uploadedBy, // Use the user who originally uploaded the file
      action: 'delete',
      entity: 'UploadedFile',
      entityId: fileId,
      details: {
        fileName: file.fileName,
        bucketName: file.bucketName,
        originalFileSize: file.fileSize,
        mimeType: file.mimeType,
      },
      status: 'success',
    });

    return {
      success: true,
      message: 'File deleted successfully',
    };
  }
}

module.exports = new UploadedFilesService();
