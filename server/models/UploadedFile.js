const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UploadedFile extends Model {
    static associate(models) {
      UploadedFile.belongsTo(models.User, {
        foreignKey: 'uploadedBy',
        as: 'uploader',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  UploadedFile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'file_name',
        validate: { notEmpty: true },
      },
      fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'file_url',
        validate: { notEmpty: true, isUrl: true },
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'file_size',
        validate: { min: 0 },
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'mime_type',
      },
      bucketName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'bucket_name',
      },
      uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'uploaded_by',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'UploadedFile',
      tableName: 'uploaded_files',
    }
  );

  return UploadedFile;
};
