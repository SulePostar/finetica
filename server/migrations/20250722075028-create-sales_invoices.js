'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoices', {
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
      customer_id: {
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
      delivery_period: Sequelize.STRING,
      total_amount: Sequelize.DECIMAL(18, 2),
      vat_category: Sequelize.STRING,
      approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
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
    await queryInterface.dropTable('sales_invoices');
  },
};
