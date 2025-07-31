const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate({ BusinessPartner }) {
      Contract.belongsTo(BusinessPartner, { foreignKey: 'partnerId' });
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
        field: 'partner_id',
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        field: 'contract_number',
      },
      contractType: {
        type: DataTypes.STRING(50),
        field: 'contract_type',
      },
      description: {
        type: DataTypes.TEXT,
      },
      startDate: {
        type: DataTypes.DATE,
        field: 'start_date',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      paymentTerms: {
        type: DataTypes.TEXT,
        field: 'payment_terms',
      },
      currency: {
        type: DataTypes.STRING(3),
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
      },
      signedAt: {
        type: DataTypes.DATE,
        field: 'signed_at',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: 'Contract',
      tableName: 'contracts',
    }
  );

  return Contract;
};
