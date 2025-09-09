const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractProcessingLog extends Model { }

  ContractProcessingLog.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isProcessed: {
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
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'ContractProcessingLog',
      tableName: 'contract_processing_logs',
      timestamps: true,
      underscored: true,
    }
  );

  return ContractProcessingLog;
};
