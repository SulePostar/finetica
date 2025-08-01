const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BusinessPartner extends Model {
    static associate({ Contract, SalesInvoice, PurchaseInvoice, BankTransaction }) {
      BusinessPartner.hasMany(Contract, { foreignKey: 'partnerId' });
      BusinessPartner.hasMany(SalesInvoice, { foreignKey: 'customerId' });
      BusinessPartner.hasMany(PurchaseInvoice, { foreignKey: 'supplierId' });
      BusinessPartner.hasMany(BankTransaction, { foreignKey: 'partnerId' });
    }
  }

  BusinessPartner.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('customer', 'supplier', 'both'),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      shortName: {
        type: DataTypes.STRING,
        field: 'short_name',
      },
      countryCode: {
        type: DataTypes.STRING(3),
        field: 'country_code',
      },
      vatNumber: {
        type: DataTypes.STRING,
        field: 'vat_number',
      },
      taxId: {
        type: DataTypes.STRING,
        field: 'tax_id',
      },
      registrationNumber: {
        type: DataTypes.STRING,
        field: 'registration_number',
      },
      isVatRegistered: {
        field: 'is_vat_registered',
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      postalCode: {
        type: DataTypes.STRING,
        field: 'postal_code',
      },

      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      iban: {
        type: DataTypes.STRING,
      },
      bankName: {
        type: DataTypes.STRING,
        field: 'bank_name',
      },
      swiftCode: {
        type: DataTypes.STRING(20),
        field: 'swift_code',
      },
      defaultCurrency: {
        type: DataTypes.STRING(3),
        field: 'default_currency',
      },
      languageCode: {
        type: DataTypes.STRING(3),
        field: 'language_code',
      },
      paymentTerms: {
        type: DataTypes.TEXT,
        field: 'payment_terms',
      },
      isActive: {
        field: 'is_active',
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      note: {
        type: DataTypes.TEXT,
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
      modelName: 'BusinessPartner',
      tableName: 'business_partners',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return BusinessPartner;
};
