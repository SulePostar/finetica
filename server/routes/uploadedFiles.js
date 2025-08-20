const express = require('express');
const router = express.Router();
const uploadedFilesController = require('../controllers/uploadedFiles');
const {
  profileImageUpload,
  fileUpload,
  handleUploadErrors,
} = require('../middleware/uploadMiddleware');
const hasRole = require('../middleware/hasRole');
const isAuthenticated = require('../middleware/isAuthenticated');

// Upload routes
router.post(
  '/upload-profile-image',
  profileImageUpload.single('profileImage'),
  uploadedFilesController.uploadProfileImage
);
router.post(
  '/upload',
  isAuthenticated,
  hasRole(['admin']),
  fileUpload.single('file'),
  uploadedFilesController.uploadFile
);
router.delete('/storage/:id', isAuthenticated, hasRole(['admin']), uploadedFilesController.deleteFileFromStorage);

// File management routes
router.get('/stats', isAuthenticated, hasRole(['admin']), uploadedFilesController.getFileStats);
router.get('/my-files', uploadedFilesController.getMyFiles);
router.get('/', isAuthenticated, hasRole(['admin']), uploadedFilesController.getFiles);
router.get('/:id', uploadedFilesController.getFile);
router.post('/', isAuthenticated, hasRole(['admin']), uploadedFilesController.createFile);
router.put('/:id', isAuthenticated, hasRole(['admin']), uploadedFilesController.updateFile);
router.delete('/:id', isAuthenticated, hasRole(['admin']), uploadedFilesController.deleteFile);
router.delete('/:id/permanent', isAuthenticated, hasRole(['admin']), uploadedFilesController.permanentDeleteFile);

// Error handling
router.use(handleUploadErrors);

module.exports = router;
