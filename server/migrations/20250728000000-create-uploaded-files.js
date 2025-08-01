'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('uploaded_files', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mime_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bucket_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('uploaded_files', ['uploaded_by']);
    await queryInterface.addIndex('uploaded_files', ['bucket_name']);
    await queryInterface.addIndex('uploaded_files', ['is_active']);
    await queryInterface.addIndex('uploaded_files', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('uploaded_files');
  },
};
