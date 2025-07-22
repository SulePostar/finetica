'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'invoices',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // delete items when invoice is deleted
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
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
    await queryInterface.dropTable('invoice_items');s
  },
};
