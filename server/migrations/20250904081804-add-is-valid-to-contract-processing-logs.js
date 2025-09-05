'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'contract_processing_logs', 
      'is_valid',                 
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'contract_processing_logs', 
      'is_valid'                  
    );
  },
};
