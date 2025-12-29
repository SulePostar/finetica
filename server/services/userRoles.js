const { Role, sequelize, User } = require('../models');
const { USER_ROLE } = require('../utils/constants')
const AppError = require('../utils/errorHandler');

class UserRoleService {
    async getAllUserRoles() {
        const roles = await Role.findAll({
            attributes: ['id', 'role', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
        const protectedRoleIds = [USER_ROLE.ADMIN, USER_ROLE.USER];
        const rolesWithFlag = roles.map(role => {
            const roleData = role.toJSON();
            return {
                ...roleData,
                isProtected: protectedRoleIds.includes(roleData.id)
            };
        });
        return {
            statusCode: 200,
            message: 'User roles fetched successfully',
            data: rolesWithFlag,
        };
    }

    async getUserRoleById(id) {
        const role = await Role.findByPk(id, {
            attributes: ['id', 'role', 'created_at', 'updated_at'],
        });

        if (!role) {
            throw new AppError(`User role with id ${id} not found`, 404);
        }
        const roleData = role.toJSON();
        const protectedRoleIds = [USER_ROLE.ADMIN, USER_ROLE.USER];
        roleData.isProtected = protectedRoleIds.includes(roleData.id);
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

        const existingRole = await Role.findOne({ where: { role: roleName.toLowerCase() } });
        if (existingRole) {
            throw new AppError('Role already exists', 400);
        }

        const newRole = await Role.create({ role: roleName.toLowerCase() });
        return {
            statusCode: 201,
            message: 'User role created successfully',
            data: newRole,
        };
    }

    async deleteUserRole(id) {
        const transaction = await sequelize.transaction();

        try {
            const role = await Role.findByPk(id, { transaction });
            const protectedRoleIds = [USER_ROLE.ADMIN, USER_ROLE.USER];

            if (!role) {
                throw new AppError(`User role with id ${id} not found`, 404);
            }
            if (protectedRoleIds.includes(Number(id))) {
                throw new AppError('You are not allowed to delete this protected role', 400);
            }
            await User.update(
                { roleId: USER_ROLE.USER },
                {
                    where: { roleId: id },
                    transaction
                }
            );
            await role.destroy({ transaction });

            await transaction.commit();

            return {
                statusCode: 200,
                message: 'User role deleted successfully and users reassigned.',
                data: { success: true },
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new UserRoleService();
