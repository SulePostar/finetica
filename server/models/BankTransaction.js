const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
        type: DataTypes.ENUM('in', 'out', 'Potrazuje', 'Duguje', 'credit', 'debit'),
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
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'approved_by',
      },
    },
    {
      sequelize,
      modelName: 'BankTransaction',
      tableName: 'bank_transactions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );
  return BankTransaction;
};
