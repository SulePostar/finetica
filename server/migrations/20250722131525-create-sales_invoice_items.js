'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoice_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sales_invoices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order_number: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      unit: Sequelize.STRING,
      quantity: Sequelize.DECIMAL,
      unit_price: Sequelize.DECIMAL(18, 2),
      net_subtotal: Sequelize.DECIMAL(18, 2),
      vat_amount: Sequelize.DECIMAL(18, 2),
      gross_subtotal: Sequelize.DECIMAL(18, 2)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_invoice_items');
  }
};
