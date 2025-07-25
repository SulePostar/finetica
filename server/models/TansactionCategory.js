module.exports = (sequelize, DataTypes) => {
    const TransactionCategory = sequelize.define('TransactionCategory', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        is_manual: { type: DataTypes.BOOLEAN, defaultValue: false }
    });

    TransactionCategory.associate = models => {
        TransactionCategory.hasMany(models.BankTransaction, { foreignKey: 'category_id' });
    };

    return TransactionCategory;
};
