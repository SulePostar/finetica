const axios = require('axios');
const MODEL_NAME = "models/text-embedding-004";
const API_KEY = process.env.GEMINI_API_KEY;

async function generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
        throw new Error("Text is required for embedding");
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:embedContent?key=${API_KEY}`;

        const response = await axios.post(url, {
            model: MODEL_NAME,
            content: {
                parts: [{ text: text }]
            }
        }, { headers: { "Content-Type": "application/json" } });

        if (response.data && response.data.embedding && response.data.embedding.values) {
            return response.data.embedding.values;
        } else {
            throw new Error("Invalid response format from Gemini Embedding API");
        }

    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error("Embedding Error:", errMsg);
        return null;
    }
}

module.exports = { generateEmbedding };