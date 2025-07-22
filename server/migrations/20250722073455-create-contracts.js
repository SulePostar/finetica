'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      partner_id: {
        type: Sequelize.UUID,
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
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      payment_terms: Sequelize.TEXT,
      currency: Sequelize.STRING(3),
      amount: Sequelize.DECIMAL(18, 2),
      signed_at: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contracts');
  }
};
