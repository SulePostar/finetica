'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bank_transaction_items', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            // Bank details
            bank_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            account_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            direction: {
                type: Sequelize.ENUM('in', 'out'),
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false,
            },

            // Extra details from statement line
            currency: {
                type: Sequelize.STRING(3),
                allowNull: true,
            },
            reference_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            // Link to parent transaction (statement file summary)
            transaction_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'bank_transactions', // parent table
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE', // delete items if parent transaction is deleted
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bank_transaction_items');
    },
};
