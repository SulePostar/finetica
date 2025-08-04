'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoice_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Added this to force the value of invoice_id to be set
        references: {
          model: 'purchase_invoices',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      order_number: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      net_subtotal: Sequelize.DECIMAL(18, 2),
      lump_sum: Sequelize.DECIMAL(18, 2),
      vat_amount: Sequelize.DECIMAL(18, 2),
      gross_subtotal: Sequelize.DECIMAL(18, 2),
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_invoice_items');
  },
};
