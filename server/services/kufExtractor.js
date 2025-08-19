require("dotenv").config();
const fs = require("fs");
const pdfParse = require("pdf-parse");

const kufPrompt = require("../prompts/kufPrompt");


/**
 * Extracts text from a purchase invoice PDF and asks Gemini to parse it.
 * @param {string} filePath - Path to the uploaded PDF invoice
 * @returns {Promise<string>} Extracted structured data from Gemini
 */
async function extractPurchaseInvoice(filePath) {
    try {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        const invoiceText = pdfData.text;

        const { GoogleGenerativeAI } = await import("@google/generative-ai");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("❌ GEMINI_API_KEY missing from .env");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `${kufPrompt}\n\nInvoice content:\n${invoiceText}`;


        const result = await model.generateContent(prompt);

        return result.response.text();
    } catch (err) {
        console.error("❌ Error in extractPurchaseInvoice:", err);
        throw err;
    }
}

module.exports = {
    extractPurchaseInvoice,
};
