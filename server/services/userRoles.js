const { Role } = require('../models');
const AppError = require('../utils/errorHandler');

class UserRoleService {
    async getAllUserRoles() {
        return Role.findAll({
            attributes: ['id', 'role', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
    }

    async getUserRoleById(id) {
        const role = await Role.findByPk(id, {
            attributes: ['id', 'role', 'created_at', 'updated_at'],
        });

        if (!role) {
            throw new AppError(`Role with id ${id} not found`, 404);
        }

        return role;
    }

    async createUserRole(roleName) {
        if (!roleName || typeof roleName !== 'string') {
            throw new AppError('Role name is required and must be a string', 400);
        }

        const existingRole = await Role.findOne({ where: { role: roleName } });
        if (existingRole) {
            throw new AppError('Role already exists', 400);
        }

        return Role.create({ role: roleName });
    }

    async deleteUserRole(id) {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new AppError(`Role with id ${id} not found`, 404);
        }

        await role.destroy();
        return { success: true };
    }
}

module.exports = new UserRoleService();
