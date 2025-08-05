'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing records first to ensure clean state
    await queryInterface.bulkDelete('user_roles', null, {});

    // Reset auto-increment counter (for MySQL/PostgreSQL compatibility)
    try {
      await queryInterface.sequelize.query('ALTER TABLE user_roles AUTO_INCREMENT = 1');
    } catch (error) {
      // For PostgreSQL or other databases that don't support AUTO_INCREMENT
      try {
        await queryInterface.sequelize.query('ALTER SEQUENCE user_roles_id_seq RESTART WITH 1');
      } catch (seqError) {
        console.log('Note: Could not reset sequence - this may be normal for your database type');
      }
    }

    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          id: 1,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
  },
};
