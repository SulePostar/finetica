const { UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');

class UserStatusService {
    async getAllUserStatuses() {
        return UserStatus.findAll({
            attributes: ['id', 'status', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
    }

    async getUserStatusById(id) {
        const status = await UserStatus.findByPk(id, {
            attributes: ['id', 'status', 'created_at', 'updated_at'],
        });

        if (!status) {
            throw new AppError(`User status with id ${id} not found`, 404);
        }

        return status;
    }

    async createUserStatus(statusName) {
        if (!statusName || typeof statusName !== 'string') {
            throw new AppError('Status name is required and must be a string', 400);
        }

        const existingStatus = await UserStatus.findOne({ where: { status: statusName } });
        if (existingStatus) {
            throw new AppError('Status already exists', 400);
        }

        return UserStatus.create({ status: statusName });
    }

    async deleteUserStatus(id) {
        const status = await UserStatus.findByPk(id);
        if (!status) {
            throw new AppError(`User status with id ${id} not found`, 404);
        }

        await status.destroy();
        return { success: true };
    }
}

module.exports = new UserStatusService();
