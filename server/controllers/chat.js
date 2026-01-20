const ragChatService = require('../services/ragChatService');

/**
 * Handle chat message
 * POST /api/chat
 * Body: { message: string }
 */
const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const sessionId = req.user?.id?.toString() || req.sessionID || 'anonymous';

        const response = await ragChatService.chat(sessionId, message);

        res.json({
            success: true,
            data: {
                message: response
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get conversation history
 * GET /api/chat/history
 */
const getHistory = async (req, res, next) => {
    try {
        const sessionId = req.user?.id?.toString() || req.sessionID || 'anonymous';
        const history = ragChatService.getHistory(sessionId);

        res.json({
            success: true,
            data: {
                history
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear conversation history
 * DELETE /api/chat/history
 */
const clearHistory = async (req, res, next) => {
    try {
        const sessionId = req.user?.id?.toString() || req.sessionID || 'anonymous';
        ragChatService.clearHistory(sessionId);

        res.json({
            success: true,
            message: 'Conversation history cleared'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessage,
    getHistory,
    clearHistory
};
