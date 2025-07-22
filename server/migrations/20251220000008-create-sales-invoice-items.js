'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoice_items', {
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
          model: 'sales_invoices',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Sales invoice ID (KIF)'
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
      unit: {
        type: Sequelize.STRING(20),
        comment: 'Unit of measure (piece, hour, kg, etc.)'
      },
      quantity: {
        type: Sequelize.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 1,
        comment: 'Quantity'
      },
      unit_price: {
        type: Sequelize.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unit price without VAT'
      },
      net_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net subtotal without VAT'
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
      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
        comment: 'Discount percentage'
      },
      discount_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Discount amount'
      },
      account_code: {
        type: Sequelize.STRING(20),
        comment: 'Revenue account code'
      },
      product_code: {
        type: Sequelize.STRING(50),
        comment: 'Product/service code'
      },
      revenue_center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business_units',
          key: 'id'
        },
        comment: 'Revenue center assignment'
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

    await queryInterface.addIndex('sales_invoice_items', ['invoice_id']);
    await queryInterface.addIndex('sales_invoice_items', ['invoice_id', 'line_number'], {
      unique: true,
      name: 'sales_invoice_items_unique_line'
    });
    await queryInterface.addIndex('sales_invoice_items', ['product_code']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_invoice_items');
  }
};