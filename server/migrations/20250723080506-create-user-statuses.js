'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_statuses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex('user_statuses', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_statuses');
    },
};