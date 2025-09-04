'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kuf_processing_logs', 'is_valid', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('purchase_invoices', 'file_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kuf_processing_logs', 'is_valid');
    await queryInterface.removeColumn('purchase_invoices', 'file_name');
  },
};