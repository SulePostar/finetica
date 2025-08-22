const { UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');

class UserStatusService {
    async getAllUserStatuses() {
        const statuses = await UserStatus.findAll({
            attributes: ['id', 'status', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
        return statuses;
    }

    async getUserStatusById(id) {
        const status = await UserStatus.findByPk(id, {
            attributes: ['id', 'status', 'created_at', 'updated_at'],
        });

        if (!status) {
            throw new AppError('Status not found', 404);
        }

        return status;
    }

    async createUserStatus(statusName) {
        const existingStatus = await UserStatus.findOne({ where: { status: statusName } });
        if (existingStatus) {
            throw new AppError('Status already exists', 400);
        }

        const newStatus = await UserStatus.create({ status: statusName });
        return newStatus;
    }

    async deleteUserStatus(id) {
        const status = await UserStatus.findByPk(id);
        if (!status) {
            throw new AppError('Status not found', 404);
        }

        await status.destroy();
    }
}

module.exports = new UserStatusService();
