'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('bank_transactions', 'total_base_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('bank_transactions', 'total_vat_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('bank_transactions', 'total_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('bank_transactions', 'converted_total_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });

      await queryInterface.addColumn('sales_invoices', 'total_base_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('sales_invoices', 'total_vat_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('sales_invoices', 'converted_total_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });

      await queryInterface.addColumn('purchase_invoices', 'total_base_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('purchase_invoices', 'total_vat_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('purchase_invoices', 'total_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });
      await queryInterface.addColumn('purchase_invoices', 'converted_total_amount', { type: Sequelize.DECIMAL(18, 2), defaultValue: 0, allowNull: true }, { transaction });

      await queryInterface.removeColumn('bank_transactions', 'amount', { transaction });

      await queryInterface.removeColumn('purchase_invoices', 'vat_amount', { transaction });
      await queryInterface.removeColumn('purchase_invoices', 'net_total', { transaction });
      await queryInterface.removeColumn('purchase_invoices', 'lump_sum', { transaction });

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('purchase_invoices', 'lump_sum', { type: Sequelize.DECIMAL(18, 2), allowNull: true }, { transaction });
      await queryInterface.addColumn('purchase_invoices', 'net_total', { type: Sequelize.DECIMAL(18, 2), allowNull: true }, { transaction });
      await queryInterface.addColumn('purchase_invoices', 'vat_amount', { type: Sequelize.DECIMAL(18, 2), allowNull: true }, { transaction });

      await queryInterface.addColumn('bank_transactions', 'amount', { type: Sequelize.DECIMAL(18, 2), allowNull: false, defaultValue: 0 }, { transaction });

      await queryInterface.removeColumn('purchase_invoices', 'total_base_amount', { transaction });
      await queryInterface.removeColumn('purchase_invoices', 'total_vat_amount', { transaction });
      await queryInterface.removeColumn('purchase_invoices', 'total_amount', { transaction });
      await queryInterface.removeColumn('purchase_invoices', 'converted_total_amount', { transaction });

      await queryInterface.removeColumn('sales_invoices', 'total_base_amount', { transaction });
      await queryInterface.removeColumn('sales_invoices', 'total_vat_amount', { transaction });
      await queryInterface.removeColumn('sales_invoices', 'converted_total_amount', { transaction });

      await queryInterface.removeColumn('bank_transactions', 'total_base_amount', { transaction });
      await queryInterface.removeColumn('bank_transactions', 'total_vat_amount', { transaction });
      await queryInterface.removeColumn('bank_transactions', 'total_amount', { transaction });
      await queryInterface.removeColumn('bank_transactions', 'converted_total_amount', { transaction });

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
