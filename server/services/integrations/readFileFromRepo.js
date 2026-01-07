const { githubGet } = require("./githubClient");

async function readFileFromRepo(filePath) {
    try {
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

        const response = await githubGet(url);
        const data = response.data;


        if (data.content && data.encoding === 'base64') {
            const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
            return decodedContent;
        }
        return data.content || JSON.stringify(data);

    } catch (error) {
        console.error(`Error ${filePath}:`, error.message);
        return null;
    }
}

module.exports = { readFileFromRepo };