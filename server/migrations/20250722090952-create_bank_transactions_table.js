'use strict';

module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'invoices',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      transaction_category_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'transaction_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      currency: {
        type: Sequelize.CHAR(3),
      },
      transaction_type: {
        type: Sequelize.STRING, // e.g., 'incoming', 'outgoing'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('bank_transactions');
  },
};
