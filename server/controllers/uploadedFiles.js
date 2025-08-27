const uploadedFilesService = require('../services/uploadedFiles');
const AppError = require('../utils/errorHandler');

class UploadedFilesController {
  /**
   * Upload profile image (unprotected for registration)
   * POST /api/files/upload-profile-image
   */
  async uploadProfileImage(req, res, next) {
    try {
      const { firstName, lastName } = req.body;
      const result = await uploadedFilesService.uploadProfileImage(req.file, firstName, lastName);
      res.status(200).json(result);
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
      const { bucketName, description } = req.body;
      const userId = req.user?.userId;
      const result = await uploadedFilesService.uploadFile(req.file, bucketName, userId, description);
      if (result.success === false) {
        return res.status(409).json(result);
      }
      res.status(201).json(result);
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
      const file = await uploadedFilesService.createFileRecord(
        uploadedFilesService.prepareFileData(req.body, req.user?.id)
      );
      res.status(201).json(file);
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
      const result = await uploadedFilesService.getFiles(
        uploadedFilesService.parseFileQuery(req.query)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadedFilesController();
