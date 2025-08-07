const multer = require('multer');
const uploadConfig = require('../config/upload');

// Configure multer storage
const storage = multer.memoryStorage();

// Profile image upload middleware
const profileImageUpload = multer({
  storage: storage,
  limits: {
    fileSize: uploadConfig.MAX_IMAGE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (uploadConfig.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${uploadConfig.ALLOWED_IMAGE_TYPES.join(', ')}`
        ),
        false
      );
    }
  },
});

// General file upload middleware
const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: uploadConfig.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      ...uploadConfig.ALLOWED_IMAGE_TYPES,
      ...uploadConfig.ALLOWED_DOCUMENT_TYPES,
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  },
});

// Multer error handling middleware
const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      const maxSize =
        error.field === 'profileImage' ? uploadConfig.MAX_IMAGE_SIZE : uploadConfig.MAX_FILE_SIZE;
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${error.message}`,
    });
  }

  // Handle file filter errors
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

module.exports = {
  profileImageUpload,
  fileUpload,
  handleUploadErrors,
};
