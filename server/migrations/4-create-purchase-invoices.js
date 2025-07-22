'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PurchaseInvoices', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
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
      supplierId: {
        type: Sequelize.STRING
      },
      invoiceDate: {
        type: Sequelize.DATEONLY
      },
      dateDue: {
        type: Sequelize.DATEONLY
      },
      dateReceived: {
        type: Sequelize.DATEONLY
      },
      netTotal: {
        type: Sequelize.DECIMAL(15, 2)
      },
      lumpSumPayment: {
        type: Sequelize.DECIMAL(15, 2)
      },
      vatTotal: {
        type: Sequelize.DECIMAL(15, 2)
      },
      deductibleVat: {
        type: Sequelize.DECIMAL(15, 2)
      },
      nonDeductibleVat: {
        type: Sequelize.DECIMAL(15, 2)
      },
      nonDeductibleVatRegion: {
        type: Sequelize.ENUM('FBiH', 'RS', 'Brcko')
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
    await queryInterface.dropTable('PurchaseInvoices');
  }
};