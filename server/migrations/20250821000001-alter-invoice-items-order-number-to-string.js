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
        await queryInterface.sequelize.query(`
            ALTER TABLE sales_invoice_items 
            ALTER COLUMN order_number TYPE INTEGER 
            USING CASE 
                WHEN order_number ~ '^[0-9]+$' THEN order_number::INTEGER 
                ELSE NULL 
            END
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE purchase_invoice_items 
            ALTER COLUMN order_number TYPE INTEGER 
            USING CASE 
                WHEN order_number ~ '^[0-9]+$' THEN order_number::INTEGER 
                ELSE NULL 
            END
        `);
    },
};
