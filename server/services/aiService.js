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

function checkIfPdf(buf) {
    if (!buf || buf.length < 5) return false;
    const first5 = Buffer.isBuffer(buf)
        ? buf.subarray(0, 5).toString()
        : Buffer.from(buf).subarray(0, 5).toString();
    return first5 === '%PDF-';
}

const processDocument = async (fileBuffer, mimeType, responseSchema, model, prompt) => {
    const lower = (mimeType || '').toLowerCase();
    const pdfByMime = lower === 'application/pdf' || lower.includes('pdf');
    const pdfByMagic = checkIfPdf(fileBuffer);
    const isPdf = pdfByMime || pdfByMagic;

    if (!isPdf) throw new AppError('Invalid file type. Only PDF files are allowed.', 400);

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

        const extractedData = extractJsonFromResponse(result.text);

        // Mark as not approved by default
        extractedData.approvedAt = null;
        extractedData.approvedBy = null;

        return extractedData;
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new AppError(`Failed to analyze document with AI: ${error.message}`, 500);
    }
};


const extractJsonFromResponse = (response) => {
    const match = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonStr = match ? match[1].trim() : response.trim();
    return JSON.parse(jsonStr);
}

module.exports = {
    upload,
    processDocument
};
