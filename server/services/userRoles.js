const { Role } = require('../models');
const AppError = require('../utils/errorHandler');

class UserRoleService {
    async getAllUserRoles() {
        const roles = await Role.findAll({
            attributes: ['id', 'role', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
        return roles;
    }

    async getUserRoleById(id) {
        const role = await Role.findByPk(id, {
            attributes: ['id', 'role', 'created_at', 'updated_at'],
        });

        if (!role) {
            throw new AppError('Role not found', 404);
        }

        return role;
    }

    async createUserRole(roleName) {
        const existingRole = await Role.findOne({ where: { role: roleName } });
        if (existingRole) {
            throw new AppError('Role already exists', 400);
        }

        const newRole = await Role.create({ role: roleName });
        return newRole;
    }

    async deleteUserRole(id) {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        await role.destroy();
    }
}

module.exports = new UserRoleService();