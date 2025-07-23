'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      partner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'business_partners',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      contract_number: Sequelize.STRING(50),
      contract_type: Sequelize.STRING(50),
      description: Sequelize.TEXT,
      start_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      end_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      payment_terms: Sequelize.TEXT,
      currency: Sequelize.STRING(3),
      amount: Sequelize.DECIMAL(18, 2),
      signed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contracts');
  }
};
