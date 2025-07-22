module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define('Contract', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('gen_random_uuid()'),
            primaryKey: true
        },
        partner_id: DataTypes.UUID,
        contract_number: DataTypes.STRING(50),
        contract_type: DataTypes.STRING(50),
        description: DataTypes.TEXT,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        payment_terms: DataTypes.TEXT,
        currency: DataTypes.STRING(3),
        amount: DataTypes.DECIMAL(18, 2),
        signed_at: DataTypes.DATE
    });

    Contract.associate = models => {
        Contract.belongsTo(models.BusinessPartner, { foreignKey: 'partner_id' });
    };

    return Contract;
};
