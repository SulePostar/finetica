'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      vat_period: Sequelize.STRING,
      invoice_type: Sequelize.STRING,
      invoice_number: Sequelize.STRING,
      bill_number: Sequelize.STRING,
      note: Sequelize.TEXT,
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      invoice_date: Sequelize.DATE,
      due_date: Sequelize.DATE,
      delivery_period: Sequelize.STRING,
      total_amount: Sequelize.DECIMAL(18, 2),
      vat_category: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('sales_invoice_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_id: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('sales_invoices');
  }
};
