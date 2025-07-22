'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
      contract_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'contracts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      total_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      currency: {
        type: Sequelize.CHAR(3),
      },
      status: {
        type: Sequelize.STRING, // e.g., 'paid', 'unpaid', 'partial'
      },
      notes: {
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
    await queryInterface.dropTable('invoices');
  },
};
