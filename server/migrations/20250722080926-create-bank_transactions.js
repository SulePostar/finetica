'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BankTransactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      direction: {
        type: Sequelize.STRING(10),
        validate: {
          isIn: [['in', 'out']],
        },
      },
      account_number: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TransactionCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Manually add CHECK constraint for direction
    await queryInterface.sequelize.query(`
      ALTER TABLE bank_transactions
      ADD CONSTRAINT direction_check CHECK (direction IN ('in', 'out'))
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BankTransactions');
  }
};
