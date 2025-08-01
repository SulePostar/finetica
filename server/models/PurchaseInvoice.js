const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PurchaseInvoice extends Model {
    static associate({ BusinessPartner, PurchaseInvoiceItem }) {
      this.belongsTo(BusinessPartner, { foreignKey: 'supplierId' });
      this.hasMany(PurchaseInvoiceItem, { foreignKey: 'invoiceId' });
    }
  }

  PurchaseInvoice.init(
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
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allowing null here because it may not always be provided
        field: 'supplier_id',
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
      receivedDate: {
        type: DataTypes.DATE,
        allowNull: true, // Allowing null here because it may not always be provided and today's date is ineffective
        defaultValue: null,
        field: 'received_date',
      },
      netTotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'net_total',
      },
      lumpSum: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'lump_sum',
      },
      vatAmount: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'vat_amount',
      },
      deductibleVat: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'deductible_vat',
      },
      nonDeductibleVat: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'non_deductible_vat',
      },
      vatExemptRegion: {
        type: DataTypes.STRING,
        field: 'vat_exempt_region',
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
      modelName: 'PurchaseInvoice',
      tableName: 'purchase_invoices',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return PurchaseInvoice;
};
