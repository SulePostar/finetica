const { Role } = require('../models');
const AppError = require('../utils/errorHandler');

class UserRoleService {
    async getAllUserRoles() {
        const roles = await Role.findAll({
            attributes: ['id', 'role', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
        return {
            statusCode: 200,
            message: 'User roles fetched successfully',
            data: roles,
        };
    }

    async getUserRoleById(id) {
        const role = await Role.findByPk(id, {
            attributes: ['id', 'role', 'created_at', 'updated_at'],
        });

        if (!role) {
            throw new AppError(`User role with id ${id} not found`, 404);
        }

        return {
            statusCode: 200,
            message: 'User role fetched successfully',
            data: role,
        };
    }

    async createUserRole(roleName) {
        if (!roleName || typeof roleName !== 'string') {
            throw new AppError('Role name is required and must be a string', 400);
        }

        const existingRole = await Role.findOne({ where: { role: roleName } });
        if (existingRole) {
            throw new AppError('Role already exists', 400);
        }

        const newRole = await Role.create({ role: roleName });
        return {
            statusCode: 201,
            message: 'User role created successfully',
            data: newRole,
        };
    }

    async deleteUserRole(id) {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new AppError(`User role with id ${id} not found`, 404);
        }

        const protectedRoleIds = [1, 2];
        if (protectedRoleIds.includes(Number(role.role_id))) {
            throw new AppError('You are not allowed to delete this role', 400);
        }

        await role.destroy();
        return {
            statusCode: 200,
            message: 'User role deleted successfully',
            data: { success: true },
        };
    }
}

module.exports = new UserRoleService();
