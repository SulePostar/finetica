'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tax_declarations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      period_start: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      period_end: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      delivery_value: Sequelize.DECIMAL(18, 2),
      purchase_value: Sequelize.DECIMAL(18, 2),
      export_value: Sequelize.DECIMAL(18, 2),
      import_value: Sequelize.DECIMAL(18, 2),
      exempted_delivery_value: Sequelize.DECIMAL(18, 2),
      purchase_from_farmers: Sequelize.DECIMAL(18, 2),

      output_vat_total: Sequelize.DECIMAL(18, 2),
      input_vat_total: Sequelize.DECIMAL(18, 2),
      vat_on_import: Sequelize.DECIMAL(18, 2),
      lump_sum_vat: Sequelize.DECIMAL(18, 2),
      vat_payable: Sequelize.DECIMAL(18, 2),
      vat_refund_requested: Sequelize.DECIMAL(18, 2),

      final_cons_fbiH: Sequelize.DECIMAL(18, 2),
      final_cons_rs: Sequelize.DECIMAL(18, 2),
      final_cons_bd: Sequelize.DECIMAL(18, 2),

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tax_declarations');
  }
};
