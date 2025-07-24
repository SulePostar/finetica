'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove approval_status column if it exists
    try {
      await queryInterface.removeColumn('users', 'approval_status');
    } catch (error) {
      console.log('approval_status column does not exist, skipping removal');
    }

    // Remove is_active column if it exists
    try {
      await queryInterface.removeColumn('users', 'is_active');
    } catch (error) {
      console.log('is_active column does not exist, skipping removal');
    }

    // Add status_id column
    await queryInterface.addColumn('users', 'status_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default to 'pending' status
      references: {
        model: 'user_statuses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // Add index for status_id
    await queryInterface.addIndex('users', ['status_id']);

    // Remove the old approval_status index if it exists
    try {
      await queryInterface.removeIndex('users', ['approval_status']);
    } catch (error) {
      console.log('approval_status index does not exist, skipping removal');
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove status_id column
    await queryInterface.removeColumn('users', 'status_id');

    // Add back approval_status column
    await queryInterface.addColumn('users', 'approval_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    });

    // Add back is_active column
    await queryInterface.addColumn('users', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // Add back indexes
    await queryInterface.addIndex('users', ['approval_status']);
  },
};
