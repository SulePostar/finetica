'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      period_pdv: {
        type: Sequelize.STRING(7),
        allowNull: false,
        comment: 'VAT Period'
      },
      invoice_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Invoice type'
      },
      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Invoice number in book'
      },
      document_number: {
        type: Sequelize.STRING(50),
        comment: 'Bill number (document code)'
      },
      description: {
        type: Sequelize.TEXT,
        comment: 'Description/Notes'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        comment: 'Customer ID'
      },
      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Invoice date'
      },
      due_date: {
        type: Sequelize.DATEONLY,
        comment: 'Date due'
      },
      delivery_period_start: {
        type: Sequelize.DATEONLY,
        comment: 'Delivery period start'
      },
      delivery_period_end: {
        type: Sequelize.DATEONLY,
        comment: 'Delivery period end'
      },
      net_total: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net total (amount without VAT)'
      },
      vat_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Total VAT amount'
      },
      total_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total invoice amount'
      },
      amount_type: {
        type: Sequelize.STRING(20),
        defaultValue: 'standard',
        comment: 'Amount type: internal, export, vat_free'
      },
      non_vat_system_fbih: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Non-VAT system - Federacija BiH'
      },
      non_vat_system_rs: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Non-VAT system - Republika Srpska'
      },
      non_vat_system_bd: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Non-VAT system - Brčko Distrikt'
      },
      currency: {
        type: Sequelize.CHAR(3),
        defaultValue: 'BAM',
        comment: 'Invoice currency'
      },
      exchange_rate: {
        type: Sequelize.DECIMAL(10, 6),
        defaultValue: 1,
        comment: 'Exchange rate to base currency'
      },
      business_unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business_units',
          key: 'id'
        },
        comment: 'Business unit that issued the invoice'
      },
      contract_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contracts',
          key: 'id'
        },
        comment: 'Related contract'
      },
      is_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Invoice sent status'
      },
      sent_at: {
        type: Sequelize.DATE,
        comment: 'Date when invoice was sent'
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Payment status'
      },
      paid_amount: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Amount paid so far'
      },
      paid_at: {
        type: Sequelize.DATE,
        comment: 'Date when fully paid'
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

    await queryInterface.sequelize.query(`
      ALTER TABLE sales_invoices 
      ADD CONSTRAINT sales_invoices_type_check 
      CHECK (invoice_type IN (
        'izlazna_faktura_robu_usluge',
        'izlazna_faktura_vlastita_potrosnja',
        'avansna_izlazna_faktura',
        'jci_izvoz_dobara',
        'usluge_stranom_licu',
        'umanjenje_pdv_sl2',
        'manjak_sve_vrste'
      ))
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE sales_invoices 
      ADD CONSTRAINT sales_invoices_amount_type_check 
      CHECK (amount_type IN ('standard', 'internal', 'export', 'vat_free'))
    `);

    await queryInterface.addIndex('sales_invoices', ['customer_id']);
    await queryInterface.addIndex('sales_invoices', ['invoice_date']);
    await queryInterface.addIndex('sales_invoices', ['period_pdv']);
    await queryInterface.addIndex('sales_invoices', ['invoice_number']);
    await queryInterface.addIndex('sales_invoices', ['business_unit_id']);
    await queryInterface.addIndex('sales_invoices', ['is_paid']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_invoices');
  }
};