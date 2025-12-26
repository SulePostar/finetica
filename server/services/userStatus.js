const { UserStatus, sequelize, User } = require('../models');
const AppError = require('../utils/errorHandler');

class UserStatusService {
    async getAllUserStatuses() {
        const statuses = await UserStatus.findAll({
            attributes: ['id', 'status', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });

        return {
            statusCode: 200,
            message: 'User statuses fetched successfully',
            data: statuses,
        };
    }

    async getUserStatusById(id) {
        const status = await UserStatus.findByPk(id, {
            attributes: ['id', 'status', 'created_at', 'updated_at'],
        });

        if (!status) {
            throw new AppError(`User status with id ${id} not found`, 404);
        }

        return {
            statusCode: 200,
            message: 'User status fetched successfully',
            data: status,
        };
    }

    async createUserStatus(statusName) {
        if (!statusName || typeof statusName !== 'string') {
            throw new AppError('Status name is required and must be a string', 400);
        }

        const existingStatus = await UserStatus.findOne({ where: { status: statusName } });
        if (existingStatus) {
            throw new AppError('Status already exists', 400);
        }

        const newStatus = await UserStatus.create({ status: statusName });
        return {
            statusCode: 201,
            message: 'User status created successfully',
            data: newStatus,
        };
    }

    async deleteUserStatus(id) {
        const transaction = await sequelize.transaction();
        try {
            const status = await UserStatus.findByPk(id, { transaction });
            const PENDING_STATUS_ID = 1;
            const protectedStatusIds = [1, 2, 3];
            if (!status) {
                throw new AppError(`User status with id ${id} not found`, 404);
            }
            if (protectedStatusIds.includes(Number(status.id))) {
                throw new AppError('You are not allowed to delete this status', 400);
            }
            await User.update(
                { statusId: PENDING_STATUS_ID },
                {
                    where: { statusId: id },
                    transaction
                }
            );
            await status.destroy({ transaction });
            await transaction.commit();
            return {
                statusCode: 200,
                message: 'User status deleted successfully',
                data: { success: true },
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new UserStatusService();
