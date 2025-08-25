const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractProcessedFiles extends Model {}

  ContractProcessedFiles.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ContractProcessedFiles',
      tableName: 'contract_processed_files',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeUpdate: (record) => {
          if (record.changed('status') && record.status === true) {
            record.processedAt = new Date();
          }
        },
        beforeCreate: (record) => {
          if (record.status === true && !record.processedAt) {
            record.processedAt = new Date();
          }
        },
      },
    }
  );

  return ContractProcessedFiles;
};
