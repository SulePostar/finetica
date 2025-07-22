'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false,
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
          model: 'purchase_invoices',
          key: 'id',
        },
        comment: 'Reference to purchase invoice if applicable',
      },
      sales_invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sales_invoices',
          key: 'id',
        },
        comment: 'Reference to sales invoice if applicable',
      },
      
      partner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'business_partners',
          key: 'id',
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transaction_categories',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('bank_transactions', {
      fields: ['direction'],
      type: 'check',
      where: {
        direction: ['in', 'out'],
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE bank_transactions 
      ADD CONSTRAINT bank_transactions_single_invoice_check 
      CHECK (
        (purchase_invoice_id IS NULL AND sales_invoice_id IS NULL) OR
        (purchase_invoice_id IS NOT NULL AND sales_invoice_id IS NULL) OR
        (purchase_invoice_id IS NULL AND sales_invoice_id IS NOT NULL)
      )
    `);

    await queryInterface.addIndex('bank_transactions', ['partner_id']);
    await queryInterface.addIndex('bank_transactions', ['category_id']);
    await queryInterface.addIndex('bank_transactions', ['purchase_invoice_id']);
    await queryInterface.addIndex('bank_transactions', ['sales_invoice_id']);
    await queryInterface.addIndex('bank_transactions', ['date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bank_transactions');
  },
};