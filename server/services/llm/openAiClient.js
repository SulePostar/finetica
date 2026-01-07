const { post } = require("axios");


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function chatCompletion(messages, retryCount = 0) {
    const systemMessage = messages.find((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    const contents = conversationMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
    }));

    const requestBody = {
        contents: contents,
        generationConfig: { temperature: 0.2 },
    };

    if (systemMessage) {
        requestBody.system_instruction = { parts: [{ text: systemMessage.content }] };
    }

    const MODEL_NAME = process.env.MODEL_NAME;
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const res = await post(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
            requestBody,
            { headers: { "Content-Type": "application/json" } }
        );

        if (res.data.candidates && res.data.candidates.length > 0) {
            return res.data.candidates[0].content.parts[0].text;
        }
        return "There is no answer!";

    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        if (error.response?.status === 429 || errMsg.includes("Quota exceeded")) {
            if (retryCount < 3) {
                await wait(65000);
                return chatCompletion(messages, retryCount + 1);
            }
        }
        throw new Error(`Gemini Error: ${errMsg}`);
    }
}

module.exports = { chatCompletion };