const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/errorHandler');

// Initialize Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Load documentation files at startup
const loadDocumentation = () => {
    const docsPath = path.join(__dirname, '../../docs');

    try {
        const userManual = fs.readFileSync(path.join(docsPath, 'USER_MANUAL.md'), 'utf8');
        const technicalRef = fs.readFileSync(path.join(docsPath, 'TECHNICAL_REFERENCE.md'), 'utf8');

        return `
# FINETICA DOCUMENTATION

## USER MANUAL
${userManual}

---

## TECHNICAL REFERENCE
${technicalRef}
`;
    } catch (error) {
        console.error('Error loading documentation:', error);
        return '';
    }
};

// Cache the documentation content
const documentationContext = loadDocumentation();

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are Finetica Assistant, a helpful AI assistant for the Finetica financial operations platform.

Your role is to help users understand how to use Finetica by answering questions about:
- How to use different features (uploading documents, managing invoices, bank transactions, contracts, partners)
- Navigation and UI elements
- Troubleshooting common issues
- API endpoints and technical details (for developers)

IMPORTANT GUIDELINES:
1. ONLY answer questions based on the documentation provided below
2. If a question is outside the scope of the documentation, politely say you can only help with Finetica-related questions
3. Be concise but thorough in your answers
4. Format responses with markdown when helpful (lists, code blocks, etc.)
5. If referring to specific pages or sections, mention them for easy navigation
6. For technical questions, you can reference API endpoints and data models

Here is the complete Finetica documentation for reference:

${documentationContext}

---

Now respond to user questions based on this documentation.`;

// In-memory conversation history (per session)
// In production, you might want to use Redis or a database
const conversationHistory = new Map();

const MAX_HISTORY_LENGTH = 20; // Keep last 20 messages per session

/**
 * Send a message to the RAG chatbot
 * @param {string} sessionId - Unique session identifier
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The assistant's response
 */
const chat = async (sessionId, userMessage) => {
    if (!userMessage || typeof userMessage !== 'string') {
        throw new AppError('Message is required', 400);
    }

    // Get or initialize conversation history for this session
    if (!conversationHistory.has(sessionId)) {
        conversationHistory.set(sessionId, []);
    }

    const history = conversationHistory.get(sessionId);

    // Add user message to history
    history.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    // Trim history if too long
    if (history.length > MAX_HISTORY_LENGTH) {
        history.splice(0, history.length - MAX_HISTORY_LENGTH);
    }

    try {
        // Create contents array with system prompt and conversation history
        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'I understand. I am Finetica Assistant, ready to help users with the Finetica platform based on the documentation provided. How can I assist you?' }]
            },
            ...history
        ];

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        const assistantMessage = result.text;

        // Add assistant response to history
        history.push({
            role: 'model',
            parts: [{ text: assistantMessage }]
        });

        return assistantMessage;

    } catch (error) {
        console.error('RAG Chat Error:', error);
        throw new AppError(`Failed to process chat message: ${error.message}`, 500);
    }
};

/**
 * Clear conversation history for a session
 * @param {string} sessionId - Session identifier to clear
 */
const clearHistory = (sessionId) => {
    conversationHistory.delete(sessionId);
};

/**
 * Get conversation history for a session
 * @param {string} sessionId - Session identifier
 * @returns {Array} - Conversation history
 */
const getHistory = (sessionId) => {
    const history = conversationHistory.get(sessionId) || [];
    return history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text
    }));
};

module.exports = {
    chat,
    clearHistory,
    getHistory
};
