'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('refresh_tokens', 'refresh_tokens_user_id_fkey');

    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'refresh_tokens_user_id_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('refresh_tokens', 'refresh_tokens_user_id_fkey');

    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'refresh_tokens_user_id_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    });
  }
};
