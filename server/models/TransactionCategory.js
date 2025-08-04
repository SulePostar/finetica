const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TransactionCategory extends Model {
    static associate({ BankTransaction }) {
      this.hasMany(BankTransaction, { foreignKey: 'categoryId' });
    }
  }

  TransactionCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isManual: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_manual',
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
      modelName: 'TransactionCategory',
      tableName: 'transaction_categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return TransactionCategory;
};
