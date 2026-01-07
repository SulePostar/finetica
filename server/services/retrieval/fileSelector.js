const { chatCompletion } = require("../llm/geminiClient");

const SYSTEM_PROMPT = `
You are an intelligent file selector.

TASK:
Select the TOP 3 files (MAXIMUM) that are essential to answer the user's question based on the file structure provided.

STRICT RULES:
- Return ONLY a valid JSON array of strings (file paths).
- DO NOT explain your reasoning.
- DO NOT use markdown formatting (no \`\`\`json blocks).
- DO NOT return plain text.
- ONLY return the JSON array.

If you are unsure or no files are relevant, return exactly:
["package.json", "README.md"]

Maximum 3 items.
`;

async function selectRelevantFiles(question, repoIndex) {
    console.log("LLM Router: Selecting files based on structure...");
    const fileList = repoIndex
        .map(f => f.path)
        .filter(path =>
            !path.includes("node_modules") &&
            !path.includes(".git/") &&
            !path.includes("dist/") &&
            !path.includes("build/") &&
            !path.endsWith(".png") &&
            !path.endsWith(".jpg") &&
            !path.endsWith(".jpeg") &&
            !path.endsWith(".lock")
        );

    const truncatedList = fileList.slice(0, 300).join("\n");

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        {
            role: "user",
            content: `FILE STRUCTURE:\n${truncatedList}\n\nUSER QUESTION:\n${question}`
        }
    ];

    try {
        let response = await chatCompletion(messages);
        response = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        if (!response.startsWith("[") || !response.endsWith("]")) {
            throw new Error(`LLM did not return a JSON array. Response: ${response}`);
        }

        let selectedPaths;
        try {
            selectedPaths = JSON.parse(response);
        } catch (parseError) {
            throw new Error(`JSON.parse failed. Response: ${response}`);
        }

        if (!Array.isArray(selectedPaths)) {
            throw new Error("Parsed response is not an array.");
        }

        if (selectedPaths.length > 3) {
            console.warn("LLM returned more than 3 files, truncating to top 3.");
            selectedPaths = selectedPaths.slice(0, 3);
        }

        console.log("LLM selected files:", selectedPaths);

        const resolvedFiles = repoIndex.filter(f =>
            selectedPaths.includes(f.path)
        );

        if (resolvedFiles.length === 0) {
            console.warn("No matching files found in index, activating fallback.");
            return repoIndex.filter(
                f =>
                    f.path === "package.json" ||
                    f.path.toLowerCase().includes("readme")
            );
        }

        return resolvedFiles;

    } catch (error) {
        console.error("Error in smart selector:", error.message);

        return repoIndex.filter(
            f =>
                f.path === "package.json" ||
                f.path.toLowerCase().includes("readme")
        );
    }
}

module.exports = { selectRelevantFiles };