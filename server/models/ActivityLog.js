'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ActivityLog extends Model {
        static associate(models) {
            // Define associations here
            ActivityLog.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    ActivityLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id',
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'Action performed (e.g., login, create, update, delete)',
            },
            entity: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: 'Entity type (e.g., User, Contract, Invoice)',
            },
            entityId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'entity_id',
                comment: 'ID of the affected entity',
            },
            details: {
                type: DataTypes.JSONB,
                allowNull: true,
                comment: 'Additional details about the action',
            },
            ipAddress: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ip_address',
                comment: 'IP address of the user',
            },
            userAgent: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'user_agent',
                comment: 'User agent string',
            },
            status: {
                type: DataTypes.ENUM('success', 'failure', 'pending'),
                allowNull: false,
                defaultValue: 'success',
                comment: 'Status of the action',
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'ActivityLog',
            tableName: 'activity_logs',
            timestamps: false,
            indexes: [
                {
                    fields: ['user_id'],
                },
                {
                    fields: ['action'],
                },
                {
                    fields: ['entity'],
                },
                {
                    fields: ['created_at'],
                },
                {
                    fields: ['user_id', 'created_at'],
                },
            ],
        }
    );

    return ActivityLog;
};
