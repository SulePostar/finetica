'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tax_declarations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      period_start: Sequelize.DATE,
      period_end: Sequelize.DATE,

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

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tax_declarations');
  }
};
