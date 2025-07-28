const uploadedFilesService = require('../services/uploadedFiles');
const { handleError } = require('../utils/errorHandler');

class UploadedFilesController {
  /**
   * Create a new file record
   * POST /api/files
   */
  async createFile(req, res) {
    try {
      const fileData = {
        ...req.body,
        uploaded_by: req.user?.userId, // Get userId from JWT payload
      };

      const file = await uploadedFilesService.createFileRecord(fileData);

      res.status(201).json({
        success: true,
        message: 'File record created successfully',
        data: file,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create file record');
    }
  }

  /**
   * Get file by ID
   * GET /api/files/:id
   */
  async getFile(req, res) {
    try {
      const { id } = req.params;
      const file = await uploadedFilesService.getFileById(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      res.json({
        success: true,
        data: file,
      });
    } catch (error) {
      handleError(res, error, 'Failed to get file');
    }
  }

  /**
   * Get all files with pagination and filters
   * GET /api/files
   */
  async getFiles(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        uploaded_by: req.query.uploaded_by,
        bucket_name: req.query.bucket_name,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : true,
        search: req.query.search,
      };

      const result = await uploadedFilesService.getFiles(options);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleError(res, error, 'Failed to get files');
    }
  }

  /**
   * Get current user's files
   * GET /api/files/my-files
   */
  async getMyFiles(req, res) {
    try {
      const userId = req.user?.userId; // Fix: use userId from JWT payload
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const options = {
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : true,
        limit: parseInt(req.query.limit) || 50,
      };

      const files = await uploadedFilesService.getFilesByUser(userId, options);

      res.json({
        success: true,
        data: files,
      });
    } catch (error) {
      handleError(res, error, 'Failed to get user files');
    }
  }

  /**
   * Update file record
   * PUT /api/files/:id
   */
  async updateFile(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.uploaded_by;
      delete updateData.created_at;
      delete updateData.updated_at;

      const file = await uploadedFilesService.updateFile(id, updateData);

      res.json({
        success: true,
        message: 'File updated successfully',
        data: file,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update file');
    }
  }

  /**
   * Soft delete file (mark as inactive)
   * DELETE /api/files/:id
   */
  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      await uploadedFilesService.deleteFile(id);

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete file');
    }
  }

  /**
   * Permanently delete file
   * DELETE /api/files/:id/permanent
   */
  async permanentDeleteFile(req, res) {
    try {
      const { id } = req.params;
      await uploadedFilesService.permanentDeleteFile(id);

      res.json({
        success: true,
        message: 'File permanently deleted',
      });
    } catch (error) {
      handleError(res, error, 'Failed to permanently delete file');
    }
  }

  /**
   * Get file statistics
   * GET /api/files/stats
   */
  async getFileStats(req, res) {
    try {
      const stats = await uploadedFilesService.getFileStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      handleError(res, error, 'Failed to get file statistics');
    }
  }
}

module.exports = new UploadedFilesController();
