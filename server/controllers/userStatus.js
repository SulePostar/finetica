const userStatusService = require('../services/userStatus');

const getAllUserStatuses = async (req, res) => {
    try {
        const statuses = await userStatusService.getAllUserStatuses();
        res.status(200).json({ message: 'User statuses fetched successfully', data: statuses });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const getUserStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await userStatusService.getUserStatusById(id);
        res.status(200).json({ message: 'User status fetched successfully', data: status });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const createUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const newStatus = await userStatusService.createUserStatus(status);
        res.status(201).json({ message: 'User status created successfully', data: newStatus });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const deleteUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        await userStatusService.deleteUserStatus(id);
        res.status(200).json({ message: 'User status deleted successfully' });
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
