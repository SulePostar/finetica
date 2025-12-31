const { UserStatus, User, sequelize } = require('../models');
const { Sequelize } = require('sequelize');
const { USER_STATUS } = require('../utils/constants');
const AppError = require('../utils/errorHandler');


class UserStatusService {
    async getAllUserStatuses() {
        const statuses = await UserStatus.findAll({
            attributes: ['id', 'status', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
        });
        const protectedStatusIds = [
            USER_STATUS.PENDING,
            USER_STATUS.APPROVED,
            USER_STATUS.REJECTED
        ];


        const statusesWithFlag = statuses.map(status => {
            const statusData = status.toJSON();
            return {
                ...statusData,
                isProtected: protectedStatusIds.includes(statusData.id)
            };
        });

        return {
            statusCode: 200,
            message: 'User statuses fetched successfully',
            data: statusesWithFlag,

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
        const transaction = await sequelize.transaction();
        try {
            const status = await UserStatus.findByPk(id, { transaction });
            const protectedStatusIds = [USER_STATUS.PENDING, USER_STATUS.APPROVED, USER_STATUS.REJECTED];
            if (!status) {
                throw new AppError(`User status with id ${id} not found`, 404);
            }
            if (protectedStatusIds.includes(Number(status.id))) {
                throw new AppError('You are not allowed to delete this status', 400);
            }
            await User.update(
                { statusId: USER_STATUS.PENDING },
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
