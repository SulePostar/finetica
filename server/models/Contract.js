const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate({ BusinessPartner }) {
      this.belongsTo(BusinessPartner, { foreignKey: 'partnerId' });
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
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
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
