const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SalesInvoice extends Model {
    static associate({ BusinessPartner, SalesInvoiceItem }) {
      this.belongsTo(BusinessPartner, { foreignKey: 'customerId' });
      this.hasMany(SalesInvoiceItem, { foreignKey: 'invoiceId' });
    }
  }

  SalesInvoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vatPeriod: {
        type: DataTypes.STRING,
        field: 'vat_period',
      },
      invoiceType: {
        type: DataTypes.STRING,
        field: 'invoice_type',
      },
      invoiceNumber: {
        type: DataTypes.STRING,
        field: 'invoice_number',
      },
      billNumber: {
        type: DataTypes.STRING,
        field: 'bill_number',
      },
      note: {
        type: DataTypes.TEXT,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allowing null here because it may not always be provided
        field: 'customer_id',
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
        field: 'invoice_date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
        field: 'due_date',
      },
      deliveryPeriod: {
        type: DataTypes.STRING,
        field: 'delivery_period',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'total_amount',
      },
      vatCategory: {
        type: DataTypes.STRING,
        field: 'vat_category',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'approved_by',
      },
    },
    {
      sequelize,
      modelName: 'SalesInvoice',
      tableName: 'sales_invoices',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  return SalesInvoice;
};
