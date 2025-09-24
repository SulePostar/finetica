'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing records first to ensure clean state
    await queryInterface.bulkDelete('user_statuses', null, {});

    // Reset auto-increment counter (for MySQL/PostgreSQL compatibility)
    try {
      await queryInterface.sequelize.query('ALTER TABLE user_statuses AUTO_INCREMENT = 1');
    } catch (error) {
      // For PostgreSQL or other databases that don't support AUTO_INCREMENT
      try {
        await queryInterface.sequelize.query('ALTER SEQUENCE user_statuses_id_seq RESTART WITH 1');
      } catch (seqError) {
        console.log('Note: Could not reset sequence - this may be normal for your database type');
      }
    }

    await queryInterface.bulkInsert(
      'user_statuses',
      [
        {
          id: 1,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          status: 'approved',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          status: 'rejected',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_statuses', null, {});
  },
};
