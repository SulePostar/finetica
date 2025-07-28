const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TaxDeclaration extends Model {
    static associate() {}
  }

  TaxDeclaration.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      periodStart: {
        type: DataTypes.DATE,
        field: 'period_start',
      },
      periodEnd: {
        type: DataTypes.DATE,
        field: 'period_end',
      },
      deliveryValue: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'delivery_value',
      },
      purchaseValue: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'purchase_value',
      },
      exportValue: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'export_value',
      },
      importValue: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'import_value',
      },
      exemptedDeliveryValue: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'exempted_delivery_value',
      },
      purchaseFromFarmers: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'purchase_from_farmers',
      },
      outputVatTotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'output_vat_total',
      },
      inputVatTotal: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'input_vat_total',
      },
      vatOnImport: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'vat_on_import',
      },
      lumpSumVat: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'lump_sum_vat',
      },
      vatPayable: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'vat_payable',
      },
      vatRefundRequested: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'vat_refund_requested',
      },
      finalConsFbiH: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'final_cons_fbiH',
      },
      finalConsRs: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'final_cons_rs',
      },
      finalConsBd: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'final_cons_bd',
      },
    },
    {
      sequelize,
      modelName: 'TaxDeclaration',
      tableName: 'tax_declarations',
    }
  );

  return TaxDeclaration;
};
