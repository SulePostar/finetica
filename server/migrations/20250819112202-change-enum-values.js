'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new ENUM values
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_transactions_direction" ADD VALUE IF NOT EXISTS 'Potrazuje';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_transactions_direction" ADD VALUE IF NOT EXISTS 'Duguje';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_transactions_direction" ADD VALUE IF NOT EXISTS 'credit';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bank_transactions_direction" ADD VALUE IF NOT EXISTS 'debit';
    `);
  },

  async down(queryInterface, Sequelize) {
    console.warn('Reverting ENUM values is not straightforward in PostgreSQL and requires manual steps.');
  }
};
