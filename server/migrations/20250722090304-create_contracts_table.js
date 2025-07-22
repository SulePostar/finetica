'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'business_partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      contract_number: {
        type: Sequelize.STRING,
      },
      contract_type: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      payment_terms: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.CHAR(3),
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      signed_at: {
        type: Sequelize.DATE,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('contracts');
  },
};
