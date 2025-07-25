module.exports = (sequelize, DataTypes) => {
    const TaxDeclaration = sequelize.define('TaxDeclaration', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        period_start: DataTypes.DATE,
        period_end: DataTypes.DATE,
        delivery_value: DataTypes.DECIMAL(18, 2),
        purchase_value: DataTypes.DECIMAL(18, 2),
        export_value: DataTypes.DECIMAL(18, 2),
        import_value: DataTypes.DECIMAL(18, 2),
        exempted_delivery_value: DataTypes.DECIMAL(18, 2),
        purchase_from_farmers: DataTypes.DECIMAL(18, 2),
        output_vat_total: DataTypes.DECIMAL(18, 2),
        input_vat_total: DataTypes.DECIMAL(18, 2),
        vat_on_import: DataTypes.DECIMAL(18, 2),
        lump_sum_vat: DataTypes.DECIMAL(18, 2),
        vat_payable: DataTypes.DECIMAL(18, 2),
        vat_refund_requested: DataTypes.DECIMAL(18, 2),
        final_cons_fbiH: DataTypes.DECIMAL(18, 2),
        final_cons_rs: DataTypes.DECIMAL(18, 2),
        final_cons_bd: DataTypes.DECIMAL(18, 2)
    });

    return TaxDeclaration;
};
