'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add is_valid field to kif_processing_logs table
        await queryInterface.addColumn('kif_processing_logs', 'is_valid', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        // Add file_name field to sales_invoices table
        await queryInterface.addColumn('sales_invoices', 'file_name', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the added columns in reverse order
        await queryInterface.removeColumn('sales_invoices', 'file_name');
        await queryInterface.removeColumn('kif_processing_logs', 'is_valid');
    },
};
