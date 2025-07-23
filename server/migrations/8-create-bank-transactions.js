'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BankTransactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      direction: {
        type: Sequelize.STRING(10),
        validate: {
          isIn: [['in', 'out']],
        },
      },
      account_number: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      purchase_invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'PurchaseInvoices',
          key: 'id',
        },
      },
      sales_invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'SalesInvoices',
          key: 'id',
        },
      },
      partner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'BusinessPartners',
          key: 'id',
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TransactionCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Manually add CHECK constraint for direction
    await queryInterface.sequelize.query(`
      ALTER TABLE "BankTransactions"
      ADD CONSTRAINT direction_check CHECK (direction IN ('in', 'out'))
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BankTransactions');
  }
};
