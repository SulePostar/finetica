const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BusinessUnit extends Model {
    static associate(models) {
      BusinessUnit.belongsTo(models.BusinessUnit, {
        as: 'parentUnit',
      });
    }
  }

  BusinessUnit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      code: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      parentUnitId: {
        type: DataTypes.INTEGER,
        field: 'parent_unit_id',
      },
      managerId: {
        type: DataTypes.INTEGER,
        field: 'manager_id',
      },
      locationId: {
        type: DataTypes.INTEGER,
        field: 'location_id',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'BusinessUnit',
      tableName: 'business_units',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );
  return BusinessUnit;
};
