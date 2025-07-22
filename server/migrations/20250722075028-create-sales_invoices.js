'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      vat_period: Sequelize.STRING,
      invoice_type: Sequelize.STRING,
      invoice_number: Sequelize.STRING,
      bill_number: Sequelize.STRING,
      note: Sequelize.TEXT,
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      invoice_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      due_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      delivery_period: Sequelize.STRING,
      total_amount: Sequelize.DECIMAL(18, 2),
      vat_category: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_invoices');
  }
};
