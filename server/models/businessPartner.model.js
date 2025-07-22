module.exports = (sequelize, DataTypes) => {
    const BusinessPartner = sequelize.define('BusinessPartner', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('customer', 'supplier', 'both'),
            allowNull: false
        },
        name: DataTypes.STRING,
        short_name: DataTypes.STRING,
        country_code: DataTypes.STRING(2),
        vat_number: DataTypes.STRING,
        tax_id: DataTypes.STRING,
        registration_number: DataTypes.STRING,
        is_vat_registered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        postal_code: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        iban: DataTypes.TEXT,
        bank_name: DataTypes.STRING,
        swift_code: DataTypes.STRING(20),
        default_currency: DataTypes.STRING(3),
        language_code: DataTypes.STRING(2),
        payment_terms: DataTypes.TEXT,
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        note: DataTypes.TEXT
    });

    BusinessPartner.associate = models => {
        BusinessPartner.hasMany(models.Contract, { foreignKey: 'partner_id' });
        BusinessPartner.hasMany(models.SalesInvoice, { foreignKey: 'customer_id' });
        BusinessPartner.hasMany(models.PurchaseInvoice, { foreignKey: 'supplier_id' });
        BusinessPartner.hasMany(models.BankTransaction, { foreignKey: 'partner_id' });
    };

    return BusinessPartner;
};
