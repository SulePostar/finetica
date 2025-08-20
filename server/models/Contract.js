const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate({ BusinessPartner }) {
      Contract.belongsTo(BusinessPartner, {
        foreignKey: 'partnerId',
        as: 'businessPartner'
      });
    }
  }

  Contract.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      partnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contractNumber: {
        type: DataTypes.STRING(50),
      },
      contractType: {
        type: DataTypes.STRING(50),
      },
      description: {
        type: DataTypes.TEXT,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      endDate: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      paymentTerms: {
        type: DataTypes.TEXT,
      },
      currency: {
        type: DataTypes.STRING(3),
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
      },
      signedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      approvedAt: {
        type: DataTypes.DATE,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Contract',
      tableName: 'contracts',
      timestamps: true,
      underscored: true,
    }
  );

  return Contract;
};
