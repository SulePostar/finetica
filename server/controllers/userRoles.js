const userRoleService = require('../services/userRoles');

const getAllUserRoles = async (req, res) => {
    try {
        const roles = await userRoleService.getAllUserRoles();
        res.status(200).json({ message: 'User roles fetched successfully', data: roles });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const getUserRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await userRoleService.getUserRoleById(id);
        res.status(200).json({ message: 'User role fetched successfully', data: role });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const createUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const newRole = await userRoleService.createUserRole(role);
        res.status(201).json({ message: 'User role created successfully', data: newRole });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const deleteUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        await userRoleService.deleteUserRole(id);
        res.status(200).json({ message: 'User role deleted successfully' });
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
