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
        field: 'invoice_id',
      },
      orderNumber: {
        type: DataTypes.INTEGER,
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
      modelName: 'PurchaseInvoiceItem',
      tableName: 'purchase_invoice_items',
    }
  );

  return PurchaseInvoiceItem;
};
