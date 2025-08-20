'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('sales_invoices', 'approved_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn('sales_invoices', 'approved_by', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('sales_invoices', 'approved_by');
        await queryInterface.removeColumn('sales_invoices', 'approved_at');
    },
};
