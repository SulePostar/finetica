'use strict';

const tables = [
  'bank_transactions',
  'sales_invoices',
  'purchase_invoices'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      for (const table of tables) {
        await queryInterface.addColumn(table, 'currency', {
          type: Sequelize.STRING(3),
          allowNull: true,
        }, { transaction: t });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      for (const table of tables) {
        await queryInterface.removeColumn(table, 'currency', { transaction: t });
      }
    });
  }
};
