'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InvoiceItems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoiceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'SalesInvoices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.INTEGER // Redni broj
      },
      itemDescription: {
        type: Sequelize.TEXT // Opis
      },
      unit: {
        type: Sequelize.STRING // Jedinica mjere
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2) // Količina
      },
      unitPrice: {
        type: Sequelize.DECIMAL(15, 2) // Cijena
      },
      netSubtotal: {
        type: Sequelize.DECIMAL(15, 2) // Iznos bez PDV-a
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2) // Iznos sa PDV-om
      },
      vat: {
        type: Sequelize.DECIMAL(15, 2) // Obračunati PDV
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
    await queryInterface.dropTable('InvoiceItems');
  }
};