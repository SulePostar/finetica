const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BankTransaction extends Model {
    static associate({ BusinessPartner, TransactionCategory }) {
      BankTransaction.belongsTo(BusinessPartner, { foreignKey: 'partnerId' });
      BankTransaction.belongsTo(TransactionCategory, { foreignKey: 'categoryId' });
    }
  }

  BankTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      direction: {
        type: DataTypes.ENUM('in', 'out'),
        allowNull: false,
      },
      accountNumber: {
        field: 'account_number',
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      invoiceId: {
        field: 'invoice_id',
        type: DataTypes.STRING, // It's a string because we assume we will get it in such format
      },
      partnerId: {
        field: 'partner_id',
        type: DataTypes.INTEGER,
      },
      categoryId: {
        field: 'category_id',
        type: DataTypes.INTEGER,
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
      modelName: 'BankTransaction',
      tableName: 'bank_transactions',
    }
  );
  return BankTransaction;
};
