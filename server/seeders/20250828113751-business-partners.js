'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('business_partners', [
      {
        id: 1,
        type: 'customer',
        name: 'Acme Corporation',
        short_name: 'ACME',
        country_code: 'USA',
        vat_number: 'US123456789',
        tax_id: '123456789',
        registration_number: '987654321',
        is_vat_registered: true,
        address: '123 Main Street',
        city: 'New York',
        postal_code: '10001',
        email: 'contact@acme.com',
        phone: '+1-555-123-4567',
        iban: 'US00ACME00000012345678',
        bank_name: 'Bank of America',
        swift_code: 'BOFAUS3N',
        default_currency: 'USD',
        language_code: 'EN',
        payment_terms: 'Net 30 days',
        is_active: true,
        note: 'Seeded record',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('business_partners', { id: 1 });
  },
};
