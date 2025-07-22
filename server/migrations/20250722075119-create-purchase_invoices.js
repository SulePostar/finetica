'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoices', {
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
      supplier_id: {
        type: Sequelize.UUID,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      invoice_date: Sequelize.DATE,
      due_date: Sequelize.DATE,
      received_date: Sequelize.DATE,
      net_total: Sequelize.DECIMAL(18, 2),
      lump_sum: Sequelize.DECIMAL(18, 2),
      vat_amount: Sequelize.DECIMAL(18, 2),
      deductible_vat: Sequelize.DECIMAL(18, 2),
      non_deductible_vat: Sequelize.DECIMAL(18, 2),
      vat_exempt_region: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('purchase_invoice_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_id: {
        type: Sequelize.UUID,
        references: {
          model: 'purchase_invoices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order_number: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      net_subtotal: Sequelize.DECIMAL(18, 2),
      lump_sum: Sequelize.DECIMAL(18, 2),
      vat_amount: Sequelize.DECIMAL(18, 2),
      gross_subtotal: Sequelize.DECIMAL(18, 2)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_invoice_items');
    await queryInterface.dropTable('purchase_invoices');
  }
};
