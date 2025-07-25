module.exports = (sequelize, DataTypes) => {
    const BankTransaction = sequelize.define('BankTransaction', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: { type: DataTypes.DATE, allowNull: false },
        amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        direction: { type: DataTypes.ENUM('in', 'out'), allowNull: false },
        accountNumber: {
            field: 'account_number',
            type: DataTypes.STRING
        },
        description: DataTypes.TEXT,
        invoice_id: DataTypes.INTEGER,
    });

    BankTransaction.associate = models => {
        BankTransaction.belongsTo(models.BusinessPartner, { foreignKey: 'partner_id' });
        BankTransaction.belongsTo(models.TransactionCategory, { foreignKey: 'category_id' });
    };

    return BankTransaction;
};
