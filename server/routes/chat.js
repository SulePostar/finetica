const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const { verifyToken } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(verifyToken);

// Send a message to the chatbot
router.post('/', chatController.sendMessage);

// Get conversation history
router.get('/history', chatController.getHistory);

// Clear conversation history
router.delete('/history', chatController.clearHistory);

module.exports = router;
