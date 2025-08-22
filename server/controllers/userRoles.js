const userRoleService = require('../services/userRoles');

const getAllUserRoles = async (req, res) => {
    console.log('Fetching all user roles');
    try {
        const roles = await userRoleService.getAllUserRoles();
        res.status(200).json({ message: 'User roles fetched successfully', data: roles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user roles', details: error.message });
    }
};

const getUserRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await userRoleService.getUserRoleById(id);
        if (!role) {
            return res.status(404).json({ error: `User role with id ${id} not found` });
        }
        res.status(200).json({ message: 'User role fetched successfully', data: role });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: 'Failed to fetch user role', details: error.message });
    }
};

const createUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || typeof role !== 'string') {
            return res.status(400).json({ error: 'Role name is required and must be a string' });
        }

        const newRole = await userRoleService.createUserRole(role);
        res.status(201).json({ message: 'User role created successfully', data: newRole });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user role', details: error.message });
    }
};

const deleteUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userRoleService.deleteUserRole(id);
        // if (!deleted) {
        //   return res.status(404).json({ error: `User role with id ${id} not found` });
        // }
        res.status(200).json({ message: 'User role deleted successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: 'Failed to delete user role', details: error.message });
    }
};

module.exports = {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
};