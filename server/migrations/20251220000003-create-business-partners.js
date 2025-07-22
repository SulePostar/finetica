'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['customer', 'supplier', 'both']],
        },
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      short_name: {
        type: Sequelize.STRING(100),
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
        type: Sequelize.STRING(100),
      },
      postal_code: {
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(255),
      },
      phone: {
        type: Sequelize.STRING(50),
      },
      iban: {
        type: Sequelize.STRING(34),
      },
      bank_name: {
        type: Sequelize.STRING(255),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('business_partners', {
      fields: ['type'],
      type: 'check',
      where: {
        type: ['customer', 'supplier', 'both'],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_partners');
  },
};
