'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tax_declarations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      period_start: {
        type: Sequelize.DATE,
        allowNull: false, // Should not be null or default to current timestamp
      },
      period_end: {
        type: Sequelize.DATE,
        allowNull: false, // Should not be null or default to current timestamp
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

      final_cons_fbih: Sequelize.DECIMAL(18, 2),
      final_cons_rs: Sequelize.DECIMAL(18, 2),
      final_cons_bd: Sequelize.DECIMAL(18, 2),

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tax_declarations');
  },
};
