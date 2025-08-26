const express = require('express');
const router = express.Router();
const { getContractData, approveContract, getContract } = require('../controllers/contract');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { upload } = require('../services/aiService');
const { extractAndSaveContract } = require('../services/contract');
const approveContractSchema = require('../schemas/approveContract');

router.get('/', getContractData);
router.put('/:id/approve', isAuthenticated, validate(approveContractSchema), approveContract);
router.get('/:id', isAuthenticated, getContract);

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const savedContract = await extractAndSaveContract(fileBuffer, mimeType);

    res.json({ success: true, contract: savedContract });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
