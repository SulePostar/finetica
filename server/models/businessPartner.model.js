module.exports = (sequelize, DataTypes) => {
    const BusinessPartner = sequelize.define('BusinessPartner', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('customer', 'supplier', 'both'),
            allowNull: false
        },
        name: DataTypes.TEXT,
        short_name: DataTypes.TEXT,
        country_code: DataTypes.STRING(2),
        vat_number: DataTypes.STRING,
        tax_id: DataTypes.STRING,
        registration_number: DataTypes.STRING,
        is_vat_registered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        address: DataTypes.TEXT,
        city: DataTypes.TEXT,
        postal_code: DataTypes.TEXT,
        email: DataTypes.TEXT,
        phone: DataTypes.TEXT,
        iban: DataTypes.TEXT,
        bank_name: DataTypes.TEXT,
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
