const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SalesInvoiceItem extends Model {
    static associate({ SalesInvoice }) {
      this.belongsTo(SalesInvoice, { foreignKey: 'invoiceId' });
    }
  }

  SalesInvoiceItem.init(
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
      unit: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.DECIMAL,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'unit_price',
      },
      netSubtotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'net_subtotal',
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
      modelName: 'SalesInvoiceItem',
      tableName: 'sales_invoice_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  return SalesInvoiceItem;
};
