const { ChatbotKnowledgeBase } = require('../models');

const getPendingEntries = async (req, res) => {
    try {
        const entries = await ChatbotKnowledgeBase.findAll({
            where: { status: 'pending' },
            order: [['created_at', 'DESC']]
        });
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching pending entries" });
    }
};

const approveEntry = async (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;

    try {
        await ChatbotKnowledgeBase.update(
            {
                status: 'approved',
                answer: answer
            },
            { where: { id } }
        );
        res.json({ message: "Entry approved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to approve entry" });
    }
};


const rejectEntry = async (req, res) => {
    const { id } = req.params;
    try {
        await ChatbotKnowledgeBase.destroy({ where: { id } });
        res.json({ message: "Entry rejected and deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reject entry" });
    }
};

module.exports = { getPendingEntries, approveEntry, rejectEntry };