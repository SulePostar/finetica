const { get } = require("axios");

const githubGet = async (url) => {
    try {
        return await get(url, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "Accept": "application/vnd.github.v3+json"
            },
        });
    } catch (error) {
        console.error(`GitHub API Error (${url}):`, error.response?.status, error.response?.data?.message);
        throw error;
    }
};


const searchGithubCode = async (query) => {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const q = `${query} repo:${owner}/${repo}`;
    const url = `https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=5`;

    const res = await githubGet(url);
    return res.data.items;
};

module.exports = { githubGet, searchGithubCode };