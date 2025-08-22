const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PurchaseInvoiceItem extends Model {
    static associate({ PurchaseInvoice }) {
      this.belongsTo(PurchaseInvoice, { foreignKey: 'invoiceId' });
    }
  }

  PurchaseInvoiceItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Added this to force the value of invoiceId to be set
        field: 'invoice_id',
      },
      orderNumber: {
        type: DataTypes.STRING,
        field: 'order_number',
      },
      description: {
        type: DataTypes.TEXT,
      },
      netSubtotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'net_subtotal',
      },
      lumpSum: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'lump_sum',
      },
      vatAmount: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'vat_amount',
      },
      grossSubtotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'gross_subtotal',
      },
    },
    {
      sequelize,
      modelName: 'PurchaseInvoiceItem',
      tableName: 'purchase_invoice_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  return PurchaseInvoiceItem;
};
