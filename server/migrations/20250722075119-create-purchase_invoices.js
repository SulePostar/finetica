'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vat_period: Sequelize.STRING,
      invoice_type: Sequelize.STRING,
      invoice_number: Sequelize.STRING,
      bill_number: Sequelize.STRING,
      note: Sequelize.TEXT,
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allowing null here because it may not always be provided
        references: {
          model: 'business_partners',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
      },
      received_date: {
        type: Sequelize.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
      },
      net_total: Sequelize.DECIMAL(18, 2),
      lump_sum: Sequelize.DECIMAL(18, 2),
      vat_amount: Sequelize.DECIMAL(18, 2),
      deductible_vat: Sequelize.DECIMAL(18, 2),
      non_deductible_vat: Sequelize.DECIMAL(18, 2),
      vat_exempt_region: Sequelize.STRING,
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
    await queryInterface.dropTable('purchase_invoices');
  },
};
