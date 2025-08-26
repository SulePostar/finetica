const userStatusService = require('../services/userStatus');

const getAllUserStatuses = async (req, res) => {
    try {
        const result = await userStatusService.getAllUserStatuses();
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const getUserStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userStatusService.getUserStatusById(id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const createUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await userStatusService.createUserStatus(status);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const deleteUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userStatusService.deleteUserStatus(id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
};
