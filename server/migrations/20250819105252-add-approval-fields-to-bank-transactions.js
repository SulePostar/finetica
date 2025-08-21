'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bank_transactions', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('bank_transactions', 'approved_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'NO ACTION',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('bank_transactions', 'approved_by');
    await queryInterface.removeColumn('bank_transactions', 'approved_at');
  },
};