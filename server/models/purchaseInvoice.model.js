module.exports = (sequelize, DataTypes) => {
    const PurchaseInvoice = sequelize.define('PurchaseInvoice', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        vat_period: DataTypes.STRING,
        invoice_type: DataTypes.STRING,
        invoice_number: DataTypes.STRING,
        bill_number: DataTypes.STRING,
        note: DataTypes.TEXT,
        supplier_id: DataTypes.UUID,
        invoice_date: DataTypes.DATE,
        due_date: DataTypes.DATE,
        received_date: DataTypes.DATE,
        net_total: DataTypes.DECIMAL(18, 2),
        lump_sum: DataTypes.DECIMAL(18, 2),
        vat_amount: DataTypes.DECIMAL(18, 2),
        deductible_vat: DataTypes.DECIMAL(18, 2),
        non_deductible_vat: DataTypes.DECIMAL(18, 2),
        vat_exempt_region: DataTypes.STRING
    });

    PurchaseInvoice.associate = models => {
        PurchaseInvoice.belongsTo(models.BusinessPartner, { foreignKey: 'supplier_id' });
        PurchaseInvoice.hasMany(models.PurchaseInvoiceItem, { foreignKey: 'invoice_id' });
    };

    return PurchaseInvoice;
};
