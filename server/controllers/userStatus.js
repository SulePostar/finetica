const userStatusService = require('../services/userStatus');

const getAllUserStatuses = async (req, res) => {
    console.log('Fetching all user statuses');
    try {
        const statuses = await userStatusService.getAllUserStatuses();
        res.status(200).json({ message: 'User statuses fetched successfully', data: statuses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user statuses', details: error.message });
    }
};

const getUserStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await userStatusService.getUserStatusById(id);
        if (!status) {
            return res.status(404).json({ error: `User status with id ${id} not found` });
        }
        res.status(200).json({ message: 'User status fetched successfully', data: status });
    } catch (error) {
        res
            .status(error.statusCode || 500)
            .json({ error: 'Failed to fetch user status', details: error.message });
    }
};

const createUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || typeof status !== 'string') {
            return res.status(400).json({ error: 'Status name is required and must be a string' });
        }

        const newStatus = await userStatusService.createUserStatus(status);
        res.status(201).json({ message: 'User status created successfully', data: newStatus });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user status', details: error.message });
    }
};

const deleteUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userStatusService.deleteUserStatus(id);
        // if (!deleted) {
        //   return res.status(404).json({ error: `User status with id ${id} not found` });
        // }
        res.status(200).json({ message: 'User status deleted successfully' });
    } catch (error) {
        res
            .status(error.statusCode || 500)
            .json({ error: 'Failed to delete user status', details: error.message });
    }
};

module.exports = {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
};