const userStatusService = require('../services/userStatus');

const getAllUserStatuses = async (req, res, next) => {
    try {
        const result = await userStatusService.getAllUserStatuses();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getUserStatusById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userStatusService.getUserStatusById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const result = await userStatusService.createUserStatus(status);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const deleteUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userStatusService.deleteUserStatus(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
};
