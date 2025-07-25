module.exports = (sequelize, DataTypes) => {
    const SalesInvoice = sequelize.define('SalesInvoice', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vat_period: DataTypes.STRING,
        invoice_type: DataTypes.STRING,
        invoice_number: DataTypes.STRING,
        bill_number: DataTypes.STRING,
        note: DataTypes.TEXT,
        customer_id: DataTypes.INTEGER,
        invoice_date: DataTypes.DATE,
        due_date: DataTypes.DATE,
        delivery_period: DataTypes.STRING,
        total_amount: DataTypes.DECIMAL(18, 2),
        vat_category: DataTypes.STRING
    });

    SalesInvoice.associate = models => {
        SalesInvoice.belongsTo(models.BusinessPartner, { foreignKey: 'customer_id' });
        SalesInvoice.hasMany(models.SalesInvoiceItem, { foreignKey: 'invoice_id' });
    };

    return SalesInvoice;
};
