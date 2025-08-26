const userRoleService = require('../services/userRoles');

const getAllUserRoles = async (req, res) => {
    try {
        const result = await userRoleService.getAllUserRoles();
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const getUserRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userRoleService.getUserRoleById(id);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const createUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const result = await userRoleService.createUserRole(role);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const deleteUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userRoleService.deleteUserRole(id);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
};
