const { UserStatus, Sequelize } = require('../models');

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

        const normalizedStatus = statusName.trim().toLowerCase();

        const existingStatus = await UserStatus.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('status')),
                normalizedStatus
            ),
        });

        if (existingStatus) {
            throw new AppError('Status already exists', 400);
        }

        const newStatus = await UserStatus.create({ status: normalizedStatus });

        return {
            statusCode: 201,
            message: 'User status created successfully',
            data: newStatus,
        };
    }

    async deleteUserStatus(id) {
        const status = await UserStatus.findByPk(id);
        if (!status) {
            throw new AppError(`User status with id ${id} not found`, 404);
        }

        await status.destroy();
        return {
            statusCode: 200,
            message: 'User status deleted successfully',
            data: { success: true },
        };
    }
}

module.exports = new UserStatusService();
