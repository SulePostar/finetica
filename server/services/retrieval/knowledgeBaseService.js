const { sequelize } = require('../../models');
const SIMILARITY_THRESHOLD = 0.80;

async function findSimilarQuestion(queryVector) {
    if (!queryVector) return null;
    const vectorString = `[${queryVector.join(',')}]`;

    try {
        const query = `
            SELECT id, question, answer, status, 
                   1 - (embedding <=> :vector) as similarity
            FROM chatbot_knowledge_base
            WHERE status = 'approved' 
            AND embedding IS NOT NULL
            ORDER BY similarity DESC
            LIMIT 1;
        `;

        const [results] = await sequelize.query(query, {
            replacements: { vector: vectorString },
            type: sequelize.QueryTypes.SELECT
        });

        const match = results ? results : null;
        if (match && match.similarity >= SIMILARITY_THRESHOLD) {
            return match;
        }

        return null;

    } catch (error) {
        console.error("Vector Search Error:", error);
        return null;
    }
}

module.exports = { findSimilarQuestion };