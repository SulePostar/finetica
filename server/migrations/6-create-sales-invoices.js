'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SalesInvoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      vatPeriod: {
        type: Sequelize.STRING
      },
      invoiceType: {
        type: Sequelize.STRING
      },
      invoiceNumber: {
        type: Sequelize.STRING
      },
      billNumber: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      customerId: {
        type: Sequelize.STRING
      },
      invoiceDate: {
        type: Sequelize.DATE
      },
      dateDue: {
        type: Sequelize.DATE
      },
      deliveryPeriod: {
        type: Sequelize.STRING
      },
      totalAmount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      internalInvoice: {
        type: Sequelize.BOOLEAN
      },
      exportDelivery: {
        type: Sequelize.BOOLEAN
      },
      otherFreeOfVAT: {
        type: Sequelize.BOOLEAN
      },
      outOfVATSystem: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('SalesInvoices');
  }
};