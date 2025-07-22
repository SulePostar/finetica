'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contracts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'BusinessPartners',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      contract_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      contract_type: {
        type: Sequelize.STRING(50)
      },
      description: {
        type: Sequelize.TEXT
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      payment_terms: {
        type: Sequelize.TEXT
      },
      currency: {
        type: Sequelize.CHAR(3)
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2)
      },
      signed_at: {
        type: Sequelize.DATEONLY
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contracts');
  }
};
