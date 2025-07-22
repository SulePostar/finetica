'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PurchaseInvoiceItems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoiceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'PurchaseInvoices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.INTEGER
      },
      itemDescription: {
        type: Sequelize.TEXT
      },
      netSubtotal: {
        type: Sequelize.DECIMAL(15, 2)
      },
      lumpSumPayment: {
        type: Sequelize.DECIMAL(15, 2)
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2)
      },
      vat: {
        type: Sequelize.DECIMAL(15, 2)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PurchaseInvoiceItems');
  }
};