const { ask } = require("../services/chat/chatService");

async function handleChat(req, res, next) {
    try {
        if (!req.body.message) {
            return res.status(400).json({ error: "Message required" });
        }
        const result = await ask(req.body.message);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { handleChat };