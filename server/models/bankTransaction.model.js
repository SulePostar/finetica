module.exports = (sequelize, DataTypes) => {
    const BankTransaction = sequelize.define('BankTransaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        date: { type: DataTypes.DATE, allowNull: false },
        amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        direction: { type: DataTypes.ENUM('in', 'out'), allowNull: false },
        account_number: DataTypes.TEXT,
        description: DataTypes.TEXT,
        invoice_id: DataTypes.UUID
    });

    BankTransaction.associate = models => {
        BankTransaction.belongsTo(models.BusinessPartner, { foreignKey: 'partner_id' });
        BankTransaction.belongsTo(models.TransactionCategory, { foreignKey: 'category_id' });
    };

    return BankTransaction;
};
