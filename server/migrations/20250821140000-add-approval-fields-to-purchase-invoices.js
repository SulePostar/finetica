'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('purchase_invoice', 'approved_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn('purchase_invoice', 'approved_by', {
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
        await queryInterface.removeColumn('purchase_invoice', 'approved_by');
        await queryInterface.removeColumn('purchase_invoice', 'approved_at');
    },
};