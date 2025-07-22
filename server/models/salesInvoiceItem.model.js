module.exports = (sequelize, DataTypes) => {
  const SalesInvoiceItem = sequelize.define('SalesInvoiceItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_id: DataTypes.UUID,
    order_number: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    unit: DataTypes.STRING,
    quantity: DataTypes.DECIMAL,
    unit_price: DataTypes.DECIMAL(18, 2),
    net_subtotal: DataTypes.DECIMAL(18, 2),
    vat_amount: DataTypes.DECIMAL(18, 2),
    gross_subtotal: DataTypes.DECIMAL(18, 2)
  });

  SalesInvoiceItem.associate = models => {
    SalesInvoiceItem.belongsTo(models.SalesInvoice, { foreignKey: 'invoice_id' });
  };

  return SalesInvoiceItem;
};
