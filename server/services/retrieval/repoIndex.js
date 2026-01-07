const { githubGet } = require("../integrations/githubClient");

let cachedIndex = null;
let lastFetched = 0;
const TTL = 5 * 60 * 1000;

const REPO_OWNER = process.env.GITHUB_OWNER;
const REPO_NAME = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH;

async function fetchAllFiles() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;

    const res = await githubGet(url);

    return res.data.tree
        .filter((item) => item.type === "blob")
        .map((item) => ({ path: item.path }));
}
async function getRepoIndex() {
    const now = Date.now();
    if (cachedIndex && now - lastFetched < TTL) {
        return cachedIndex;
    }

    cachedIndex = await fetchAllFiles();
    lastFetched = now;
    return cachedIndex;
}

module.exports = { getRepoIndex };