const { ask } = require("../services/chat/chatService");
const { generateEmbedding } = require("../services/llm/embeddingService");
const { findSimilarQuestion } = require("../services/retrieval/knowledgeBaseService");
const { ChatbotKnowledgeBase } = require("../models");

async function handleChat(req, res, next) {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user?.id || null;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        let questionVector = null;
        try {
            questionVector = await generateEmbedding(message);
        } catch (err) {
            console.warn("Embedding service failed. Skipping cache search.", err.message);
        }

        if (questionVector) {
            const cachedMatch = await findSimilarQuestion(questionVector);

            if (cachedMatch) {
                return res.json({
                    answer: cachedMatch.answer,
                    filesUsed: [],
                    source: "knowledge_base",
                    relatedQuestion: cachedMatch.question
                });
            }
        }

        const agentResult = await ask(message);


        try {
            await ChatbotKnowledgeBase.create({
                session_id: sessionId,
                user_id: userId,
                question: message,
                answer: agentResult.answer,
                files_used: agentResult.filesUsed || [],
                status: 'pending',
                embedding: questionVector ? JSON.stringify(questionVector) : null
            });
        } catch (dbError) {
            console.error("Failed to save to knowledge base:", dbError.message);

        }

        return res.json({
            answer: agentResult.answer,
            filesUsed: agentResult.filesUsed,
            source: "github_analysis"
        });

    } catch (error) {
        console.error("Critical Chat Controller Error:", error);
        next(error);
    }
}

module.exports = { handleChat };