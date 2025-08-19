'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmailQueue extends Model { }

    EmailQueue.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
            templateName: { type: DataTypes.STRING, allowNull: false, field: 'template_name' },
            variables: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
            status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
            createdAt: { type: DataTypes.DATE, field: 'created_at' },
            sentAt: { type: DataTypes.DATE, field: 'sent_at' },
        },
        {
            sequelize,
            modelName: 'EmailQueue',
            tableName: 'email_queue',
            timestamps: false
        }
    );

    return EmailQueue;
};
