'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('kuf_processed_files', {
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

        // Add index on file_name for faster lookups
        await queryInterface.addIndex('kuf_processed_files', ['file_name']);

        // Add index on processed status for filtering
        await queryInterface.addIndex('kuf_processed_files', ['processed']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('kuf_processed_files');
    },
};