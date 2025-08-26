const userRoleService = require('../services/userRoles');

const getAllUserRoles = async (req, res, next) => {
    try {
        const result = await userRoleService.getAllUserRoles();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getUserRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userRoleService.getUserRoleById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const result = await userRoleService.createUserRole(role);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const deleteUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userRoleService.deleteUserRole(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
};
