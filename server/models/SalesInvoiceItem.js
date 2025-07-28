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
        field: 'invoice_id',
      },
      orderNumber: {
        type: DataTypes.INTEGER,
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
      modelName: 'SalesInvoiceItem',
      tableName: 'sales_invoice_items',
    }
  );

  return SalesInvoiceItem;
};
