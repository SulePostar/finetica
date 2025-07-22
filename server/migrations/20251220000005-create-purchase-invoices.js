'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
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
      supplier_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        comment: 'Supplier ID'
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
      receipt_date: {
        type: Sequelize.DATEONLY,
        comment: 'Date of receipt'
      },
      net_total: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net total (amount without VAT)'
      },
      flat_fee: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'Paušalna naknada'
      },
      vat_deductible: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'VAT deductible amount'
      },
      vat_non_deductible: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        comment: 'VAT non-deductible amount'
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
      total_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total invoice amount'
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
        comment: 'Business unit that received the invoice'
      },
      contract_id: {
        type: Sequelize.UUID,
        references: {
          model: 'contracts',
          key: 'id'
        },
        comment: 'Related contract'
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Invoice approval status'
      },
      approved_by: {
        type: Sequelize.UUID,
        comment: 'User who approved the invoice'
      },
      approved_at: {
        type: Sequelize.DATE,
        comment: 'Approval timestamp'
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

    await queryInterface.sequelize.query(`
      ALTER TABLE purchase_invoices 
      ADD CONSTRAINT purchase_invoices_type_check 
      CHECK (invoice_type IN (
        'ulazna_faktura_robu_usluge',
        'ulazna_faktura_vlastita_potrosnja',
        'avansna_ulazna_faktura',
        'jci_uvoz_dobara',
        'usluge_iz_inostranstva',
        'naknadna_umanjenja_popusti',
        'ispravak_odbitka_ulaznog_poreza'
      ))
    `);

    await queryInterface.addIndex('purchase_invoices', ['supplier_id']);
    await queryInterface.addIndex('purchase_invoices', ['invoice_date']);
    await queryInterface.addIndex('purchase_invoices', ['period_pdv']);
    await queryInterface.addIndex('purchase_invoices', ['invoice_number']);
    await queryInterface.addIndex('purchase_invoices', ['business_unit_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_invoices');
  }
};