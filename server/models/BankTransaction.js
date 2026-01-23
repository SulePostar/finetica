const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BankTransaction extends Model {
    static associate({ BusinessPartner, TransactionCategory, BankTransactionItem }) {
      BankTransaction.belongsTo(BusinessPartner, { foreignKey: 'partnerId' });
      BankTransaction.belongsTo(TransactionCategory, { foreignKey: 'categoryId' });
      BankTransaction.hasMany(BankTransactionItem, { foreignKey: 'transactionId' });
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
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        field: 'total_amount',
      },
      totalBaseAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        field: 'total_base_amount',
      },
      totalVatAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        field: 'total_vat_amount',
      },
      convertedTotalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'total_amount',
        defaultValue: 0,
      },
      direction: {
        type: DataTypes.ENUM('in', 'out'),
        allowNull: true, // Now nullable, only required on items
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
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'file_name',
      },
      currency: {
        type: DataTypes.STRING(3),
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