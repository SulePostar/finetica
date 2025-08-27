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

// File management routes
router.get('/', isAuthenticated, hasRole(['admin']), uploadedFilesController.getFiles);
router.post('/', isAuthenticated, hasRole(['admin']), uploadedFilesController.createFile);

// Error handling
router.use(handleUploadErrors);

module.exports = router;
