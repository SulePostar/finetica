require("dotenv").config();
const { ask } = require("./services/chat/chatService");

async function runTest() {
    console.log("Starting...");
    const question = "write login implementation details";

    try {

        const result = await ask(question);

        console.log("\n answer");
        console.log(result.answer);

        console.log("\n Resource files:");
        result.filesUsed.forEach(f => console.log(` - ${f}`));

    } catch (error) {
        console.error("\n error");
        console.error(error.message);
        if (error.response) {
            console.error("Details", error.response.data);
        }
    }
}

runTest();