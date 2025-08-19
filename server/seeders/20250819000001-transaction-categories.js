'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Drop existing records first to ensure clean state
        await queryInterface.bulkDelete('transaction_categories', null, {});

        // Reset auto-increment counter (for MySQL/PostgreSQL compatibility)
        try {
            await queryInterface.sequelize.query('ALTER TABLE transaction_categories AUTO_INCREMENT = 1');
        } catch (error) {
            // For PostgreSQL or other databases that don't support AUTO_INCREMENT
            try {
                await queryInterface.sequelize.query('ALTER SEQUENCE transaction_categories_id_seq RESTART WITH 1');
            } catch (seqError) {
                console.log('Note: Could not reset sequence - this may be normal for your database type');
            }
        }

        await queryInterface.bulkInsert(
            'transaction_categories',
            [
                {
                    id: 1,
                    name: 'TAX_VAT',
                    code: '1',
                    is_manual: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 2,
                    name: 'SALARY',
                    code: '2',
                    is_manual: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 3,
                    name: 'BANK_FEES',
                    code: '3',
                    is_manual: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 4,
                    name: 'LOAN_PAY',
                    code: '4',
                    is_manual: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 5,
                    name: 'TRANSFER',
                    code: '5',
                    is_manual: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('transaction_categories', null, {});
    },
};
