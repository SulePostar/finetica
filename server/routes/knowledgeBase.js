const express = require('express');
const router = express.Router();
const { getPendingEntries, approveEntry, rejectEntry } = require('../controllers/knowledgeBaseController');
router.get('/pending', getPendingEntries);
router.put('/:id/approve', approveEntry);
router.delete('/:id', rejectEntry);

module.exports = router;