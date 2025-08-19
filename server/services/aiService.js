const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const AppError = require('../utils/errorHandler');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const processDocument = async (fileBuffer, mimeType, responseSchema, model, prompt) => {
    if (mimeType !== "application/pdf") {
        throw new AppError("Invalid file type. Only PDF files are allowed.", 400);
    }

    const contents = [
        {
            text: prompt,
        },
        {
            inlineData: {
                mimeType: "application/pdf",
                data: Buffer.from(fileBuffer).toString("base64"),
            },
        },
    ];

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const extractedData = JSON.parse(result.text);

        // Mark as not approved by default
        extractedData.approvedAt = null;
        extractedData.approvedBy = null;

        return extractedData;
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new AppError(`Failed to analyze document with AI: ${error.message}`, 500);
    }
};

module.exports = {
    upload,
    processDocument
};
