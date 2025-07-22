'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      direction: {
        type: Sequelize.ENUM('in', 'out'),
        allowNull: false
      },
      account_number: Sequelize.TEXT,
      description: Sequelize.TEXT,
      invoice_id: Sequelize.UUID,
      partner_id: Sequelize.UUID,
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transaction_categories',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bank_transactions');
  }
};
