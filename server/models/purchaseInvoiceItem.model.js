module.exports = (sequelize, DataTypes) => {
    const PurchaseInvoiceItem = sequelize.define('PurchaseInvoiceItem', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        invoice_id: DataTypes.UUID,
        order_number: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        net_subtotal: DataTypes.DECIMAL(18, 2),
        lump_sum: DataTypes.DECIMAL(18, 2),
        vat_amount: DataTypes.DECIMAL(18, 2),
        gross_subtotal: DataTypes.DECIMAL(18, 2)
    });

    PurchaseInvoiceItem.associate = models => {
        PurchaseInvoiceItem.belongsTo(models.PurchaseInvoice, { foreignKey: 'invoice_id' });
    };

    return PurchaseInvoiceItem;
};
