const express = require('express');
const router = express.Router();
const uploadedFilesController = require('../controllers/uploadedFiles');

router.post('/', uploadedFilesController.createFile);
router.get('/stats', uploadedFilesController.getFileStats);
router.get('/my-files', uploadedFilesController.getMyFiles);
router.get('/:id', uploadedFilesController.getFile);
router.get('/', uploadedFilesController.getFiles);
router.put('/:id', uploadedFilesController.updateFile);
router.delete('/:id', uploadedFilesController.deleteFile);
router.delete('/:id/permanent', uploadedFilesController.permanentDeleteFile);

module.exports = router;
