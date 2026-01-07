require("dotenv").config();
const axios = require("axios");

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const res = await axios.get(url);
        console.log("\n models");
        const models = res.data.models.filter(m =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes("generateContent")
        );

        models.forEach(m => {
            console.log(`Name: ${m.name}`);
            console.log(`Description: ${m.displayName}`);
        });

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

listModels();