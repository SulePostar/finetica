const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UploadedFile = sequelize.define(
    'UploadedFile',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      file_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUrl: true,
        },
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bucket_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'files',
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'uploaded_files',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['uploaded_by'],
        },
        {
          fields: ['bucket_name'],
        },
        {
          fields: ['is_active'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  // Define associations
  UploadedFile.associate = (models) => {
    // Association with User model
    UploadedFile.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return UploadedFile;
};
