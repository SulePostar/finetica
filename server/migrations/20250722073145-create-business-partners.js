'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_partners', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('customer', 'supplier', 'both'),
        allowNull: false,
      },
      name: Sequelize.STRING,
      short_name: Sequelize.STRING,
      country_code: Sequelize.STRING(3),
      vat_number: Sequelize.STRING,
      tax_id: Sequelize.STRING,
      registration_number: Sequelize.STRING,
      is_vat_registered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      address: Sequelize.STRING,
      city: Sequelize.STRING,
      postal_code: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      iban: Sequelize.STRING,
      bank_name: Sequelize.STRING,
      swift_code: Sequelize.STRING(20),
      default_currency: Sequelize.STRING(3),
      language_code: Sequelize.STRING(3),
      payment_terms: Sequelize.TEXT,
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      note: Sequelize.TEXT,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_partners');
  },
};
