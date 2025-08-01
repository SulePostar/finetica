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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'BusinessUnit',
      tableName: 'business_units',
    }
  );
  return BusinessUnit;
};
