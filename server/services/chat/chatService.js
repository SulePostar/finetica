const { getRepoIndex } = require("../retrieval/repoIndex");
const { selectRelevantFilesSmart } = require("../retrieval/smartFileSelector");
const { readFileFromRepo } = require("../mcp/readFile.tool");
const { chatCompletion } = require("../llm/openAiClient");

const SYSTEM_PROMPT = `
You are an expert software architect analyzing a GitHub repository named "Finetica".

RULES FOR ANALYSIS:
1.  **IGNORE BOILERPLATE:** If a README.md contains generic text like "React + Vite", IGNORE IT.
2.  **TRUST THE CODE:** Your source of truth is the code structure.
3.  **DEEP DIVE:** Explain the implementation logic in detail based on the provided code blocks.
`;

async function ask(question) {
    try {
        const start = Date.now();
        const repoIndex = await getRepoIndex();
        const relevantFiles = await selectRelevantFilesSmart(question, repoIndex);

        if (relevantFiles.length === 0) {
            return { answer: "There are no relevant files found.", filesUsed: [] };
        }
        const filePromises = relevantFiles.map(file => readFileFromRepo(file.path));
        const contents = await Promise.all(filePromises);

        let context = "";
        const filesUsed = [];

        contents.forEach((content, index) => {
            if (content) {
                const filePath = relevantFiles[index].path;
                console.log(`\n debug file (${filePath}): OK (Length: ${content.length})`);
                context += `\n\n========================================\n`;
                context += `FILE PATH: ${filePath}\n`;
                context += `========================================\n`;
                context += `${content}\n`;

                filesUsed.push(filePath);
            }
        });

        const finalUserMessage = `
Here is the relevant code context from the repository:

${context}

---------------------------------------------------
BASED ON THE CODE ABOVE, ANSWER THIS QUESTION:
"${question}"
`;

        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: finalUserMessage },
        ];


        const answer = await chatCompletion(messages);


        return { answer, filesUsed };

    } catch (error) {
        console.error("Critical error:", error);
        throw error;
    }
}

module.exports = { ask };