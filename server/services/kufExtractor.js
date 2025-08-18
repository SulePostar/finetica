const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const kufPrompt = require("../prompts/kufPrompt");

console.log("Using GEMINI_API_KEY:", process.env.GEMINI_API_KEY?.slice(0, 10) + "...");


const ai = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// console.log('AIIIIIIII:', ai)

async function extractPurchaseInvoice(pdfPath) {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    // or "gemini-1.5-pro"
    console.log('model:   ', model)

    // Read PDF as buffer
    const fileBuffer = fs.readFileSync(pdfPath);

    // Convert to base64
    const base64Data = fileBuffer.toString("base64");

    // Send file + prompt
    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: "application/pdf",
                data: base64Data,
            },
        },
        kufPrompt,
    ]);

    const text = result.response.text();

    try {
        return JSON.parse(text);
    } catch (err) {
        throw new Error("Model did not return valid JSON. Raw response:\n" + text);
    }
}

module.exports = { extractPurchaseInvoice };

// Allow running this file directly for testing
if (require.main === module) {
    const pdfPath = path.join(process.cwd(), "example_purchase_invoice.pdf");
    extractPurchaseInvoice(pdfPath)
        .then((json) => console.log(JSON.stringify(json, null, 2)))
        .catch((err) => {
            console.error("Error extracting purchase invoice:", err);
        });
}
