'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusinessPartners', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['customer', 'supplier', 'both']],
        },
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      short_name: {
        type: Sequelize.TEXT,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      vat_number: {
        type: Sequelize.STRING(50),
      },
      tax_id: {
        type: Sequelize.STRING(50),
      },
      registration_number: {
        type: Sequelize.STRING(50),
      },
      is_vat_registered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.TEXT,
      },
      postal_code: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      phone: {
        type: Sequelize.TEXT,
      },
      iban: {
        type: Sequelize.TEXT,
      },
      bank_name: {
        type: Sequelize.TEXT,
      },
      swift_code: {
        type: Sequelize.STRING(20),
      },
      default_currency: {
        type: Sequelize.CHAR(3),
      },
      language_code: {
        type: Sequelize.CHAR(2),
      },
      payment_terms: {
        type: Sequelize.TEXT,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      note: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Add CHECK constraint manually (Sequelize doesn't support CHECK well natively)
    await queryInterface.sequelize.query(`
      ALTER TABLE "BusinessPartners"
      ADD CONSTRAINT type_check CHECK (type IN ('customer', 'supplier', 'both'))
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BusinessPartners');
  }
};
