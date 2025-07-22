'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_partners', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      short_name: {
        type: Sequelize.STRING,
      },
      country_code: {
        type: Sequelize.CHAR(2),
      },
      vat_number: {
        type: Sequelize.STRING,
      },
      tax_id: {
        type: Sequelize.STRING,
      },
      registration_number: {
        type: Sequelize.STRING,
      },
      is_vat_registered: {
        type: Sequelize.BOOLEAN,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      postal_code: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      iban: {
        type: Sequelize.STRING,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      swift_code: {
        type: Sequelize.STRING,
      },
      default_currency: {
        type: Sequelize.CHAR(3),
      },
      payment_terms: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('business_partners');
  },
};
