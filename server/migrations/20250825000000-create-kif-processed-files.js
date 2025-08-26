'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('kif_processed_files', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            file_name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            processed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            processed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            error_message: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        // Add index on processed status for filtering
        await queryInterface.addIndex('kif_processed_files', ['processed']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('kif_processed_files');
    },
};
