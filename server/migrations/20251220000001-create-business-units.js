'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(20),
        unique: true
      },
      parent_unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business_units',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      manager_id: {
        type: Sequelize.INTEGER,
        // This will reference employees table if we decide to create it
        allowNull: true
      },
      location_id: {
        type: Sequelize.INTEGER,
        // This will reference locations table if we decide to create it
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_units');
  }
};