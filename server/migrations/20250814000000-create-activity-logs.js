'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('activity_logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Action performed (e.g., login, create, update, delete)',
            },
            entity: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Entity type (e.g., User, Contract, Invoice)',
            },
            entity_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'ID of the affected entity',
            },
            details: {
                type: Sequelize.JSONB,
                allowNull: true,
                comment: 'Additional details about the action',
            },
            ip_address: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'IP address of the user',
            },
            user_agent: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'User agent string',
            },
            status: {
                type: Sequelize.ENUM('success', 'failure', 'pending'),
                allowNull: false,
                defaultValue: 'success',
                comment: 'Status of the action',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes for better query performance
        await queryInterface.addIndex('activity_logs', ['user_id']);
        await queryInterface.addIndex('activity_logs', ['action']);
        await queryInterface.addIndex('activity_logs', ['entity']);
        await queryInterface.addIndex('activity_logs', ['created_at']);
        await queryInterface.addIndex('activity_logs', ['user_id', 'created_at']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('activity_logs');
    },
};
