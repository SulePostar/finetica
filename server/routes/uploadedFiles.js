const express = require('express');
const router = express.Router();
const uploadedFilesController = require('../controllers/uploadedFiles');
const { authorizeAdmin } = require('../middleware/authMiddleware');
const {
  profileImageUpload,
  fileUpload,
  handleUploadErrors,
} = require('../middleware/uploadMiddleware');

// Upload routes
router.post(
  '/upload-profile-image',
  profileImageUpload.single('profileImage'),
  uploadedFilesController.uploadProfileImage
);
router.post(
  '/upload',
  authorizeAdmin,
  fileUpload.single('file'),
  uploadedFilesController.uploadFile
);
router.delete('/storage/:id', authorizeAdmin, uploadedFilesController.deleteFileFromStorage);

// File management routes
router.get('/stats', authorizeAdmin, uploadedFilesController.getFileStats);
router.get('/my-files', uploadedFilesController.getMyFiles);
router.get('/', authorizeAdmin, uploadedFilesController.getFiles);
router.get('/:id', uploadedFilesController.getFile);
router.post('/', authorizeAdmin, uploadedFilesController.createFile);
router.put('/:id', authorizeAdmin, uploadedFilesController.updateFile);
router.delete('/:id', authorizeAdmin, uploadedFilesController.deleteFile);
router.delete('/:id/permanent', authorizeAdmin, uploadedFilesController.permanentDeleteFile);

// Error handling
router.use(handleUploadErrors);

module.exports = router;
