const uploadedFilesService = require('../services/uploadedFiles');
const AppError = require('../utils/errorHandler');

class UploadedFilesController {
  /**
   * Upload profile image (unprotected for registration)
   * POST /api/files/upload-profile-image
   */
  async uploadProfileImage(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError('No image file provided', 400);
      }

      const { firstName, lastName } = req.body;

      // Use service method to handle complete upload process
      const result = await uploadedFilesService.uploadProfileImage(req.file, firstName, lastName);

      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload file with admin protection
   * POST /api/files/upload
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 400);
      }

      const { bucketName, description } = req.body;
      const userId = req.user?.userId;

      // Use service method to handle complete upload process
      const result = await uploadedFilesService.uploadFile(
        req.file,
        bucketName,
        userId,
        description
      );

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete file from storage and database
   * DELETE /api/files/storage/:id
   */
  async deleteFileFromStorage(req, res, next) {
    try {
      const fileId = req.params.id;

      // Use service method to handle complete deletion process
      const result = await uploadedFilesService.deleteFileFromStorage(fileId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new file record
   * POST /api/files
   */
  async createFile(req, res, next) {
    try {
      const fileData = uploadedFilesService.prepareFileData(req.body, req.user?.id);
      const file = await uploadedFilesService.createFileRecord(fileData);

      res.status(201).json({
        success: true,
        message: 'File record created successfully',
        data: file,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get file by ID
   * GET /api/files/:id
   */
  async getFile(req, res, next) {
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
      next(error);
    }
  }

  /**
   * Get all files with pagination and filters
   * GET /api/files
   */
  async getFiles(req, res, next) {
    try {
      const options = uploadedFilesService.parseFileQuery(req.query);
      const result = await uploadedFilesService.getFiles(options);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's files
   * GET /api/files/my-files
   */
  async getMyFiles(req, res, next) {
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
      next(error);
    }
  }

  /**
   * Update file record
   * PUT /api/files/:id
   */
  async updateFile(req, res, next) {
    try {
      const { id } = req.params;
      const file = await uploadedFilesService.updateFile(id, req.body);

      res.json({
        success: true,
        message: 'File updated successfully',
        data: file,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft delete file (mark as inactive)
   * DELETE /api/files/:id
   */
  async deleteFile(req, res, next) {
    try {
      const { id } = req.params;
      await uploadedFilesService.deleteFile(id);

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Permanently delete file
   * DELETE /api/files/:id/permanent
   */
  async permanentDeleteFile(req, res, next) {
    try {
      const { id } = req.params;
      await uploadedFilesService.permanentDeleteFile(id);

      res.json({
        success: true,
        message: 'File permanently deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get file statistics
   * GET /api/files/stats
   */
  async getFileStats(req, res, next) {
    try {
      const stats = await uploadedFilesService.getFileStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadedFilesController();
