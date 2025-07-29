const { UploadedFile, User } = require('../models');
const { Op } = require('sequelize');

class UploadedFilesService {
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
      throw new Error(`Failed to create file record: ${error.message}`);
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
   * Update file record
   * @param {number} fileId - File ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated file record
   */
  async updateFile(fileId, updateData) {
    try {
      const file = await UploadedFile.findByPk(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      await file.update(updateData);
      return file;
    } catch (error) {
      throw new Error(`Failed to update file: ${error.message}`);
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
}

module.exports = new UploadedFilesService();
