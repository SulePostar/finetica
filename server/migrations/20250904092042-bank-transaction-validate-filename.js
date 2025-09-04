'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add is_valid column to bank_transaction_processing_logs
    await queryInterface.addColumn('bank_transaction_processing_logs', 'is_valid', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // Add fileName column to bank_transactions
    await queryInterface.addColumn('bank_transactions', 'fileName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove both columns if migration is rolled back
    await queryInterface.removeColumn('bank_transaction_processing_logs', 'is_valid');
    await queryInterface.removeColumn('bank_transactions', 'fileName');
  }
};
