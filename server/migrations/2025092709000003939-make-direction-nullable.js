'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('bank_transactions', 'direction', {
            type: Sequelize.ENUM('in', 'out'),
            allowNull: true,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'account_number', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'bank_name', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'direction', {
            type: Sequelize.ENUM('in', 'out'),
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('bank_transactions', 'direction', {
            type: Sequelize.ENUM('in', 'out'),
            allowNull: false,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'account_number', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'bank_name', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.changeColumn('bank_transaction_items', 'direction', {
            type: Sequelize.ENUM('in', 'out'),
            allowNull: false,
        });
    }
};