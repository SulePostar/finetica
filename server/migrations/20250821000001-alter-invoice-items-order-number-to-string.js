'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Change order_number from INTEGER to STRING in sales_invoice_items table
        await queryInterface.changeColumn('sales_invoice_items', 'order_number', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        // Change order_number from INTEGER to STRING in purchase_invoice_items table
        await queryInterface.changeColumn('purchase_invoice_items', 'order_number', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Use raw SQL to handle the conversion safely
        await queryInterface.changeColumn('sales_invoice_items', 'order_number', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.changeColumn('purchase_invoice_items', 'order_number', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
};
