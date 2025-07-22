'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoice_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'purchase_invoices',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Purchase invoice ID (KUF)'
      },
      line_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Order/line number'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Item description'
      },
      quantity: {
        type: Sequelize.DECIMAL(18, 4),
        defaultValue: 1,
        comment: 'Quantity'
      },
      unit: {
        type: Sequelize.STRING(20),
        comment: 'Unit of measure (piece, hour, kg, etc.)'
      },
      unit_price: {
        type: Sequelize.DECIMAL(18, 4),
        defaultValue: 0,
        comment: 'Unit price without VAT'
      },
      net_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net amount without VAT'
      },
      flat_fee: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Paušalna naknada'
      },
      vat_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
        comment: 'VAT rate percentage'
      },
      vat_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Calculated VAT amount'
      },
      total_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount with VAT'
      },
      account_code: {
        type: Sequelize.STRING(20),
        comment: 'Accounting code/account'
      },
      cost_center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business_units',
          key: 'id'
        },
        comment: 'Cost center assignment'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await queryInterface.addIndex('purchase_invoice_items', ['invoice_id']);
    await queryInterface.addIndex('purchase_invoice_items', ['invoice_id', 'line_number'], {
      unique: true,
      name: 'purchase_invoice_items_unique_line'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_invoice_items');
  }
};