'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('contracts', 'approved_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });

      await queryInterface.addColumn('contracts', 'approved_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contracts', 'approved_at');
    await queryInterface.removeColumn('contracts', 'approved_by');
  },
};
