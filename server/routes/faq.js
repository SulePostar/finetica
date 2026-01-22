const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq');

router.get('/', faqController.getFaqs);
router.post('/', faqController.createFaq);
router.delete('/:id', faqController.deleteFaq);

module.exports = router; 