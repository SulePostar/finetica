const uploadedFilesService = require('../services/uploadedFiles');
const { handleError } = require('../utils/errorHandler');

class UploadedFilesController {
  /**
   * Create a new file record
   * POST /api/files
   */
  async createFile(req, res) {
    try {
      const fileData = uploadedFilesService.prepareFileData(req.body, req.user?.id);
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
      const options = uploadedFilesService.parseFileQuery(req.query);
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
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const options = uploadedFilesService.parseUserFilesQuery(req.query);
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
      const file = await uploadedFilesService.updateFile(id, req.body);

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
