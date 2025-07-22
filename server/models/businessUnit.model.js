'use strict';

module.exports = (sequelize, DataTypes) => {
    const BusinessUnit = sequelize.define('BusinessUnit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(100),
        code: {
            type: DataTypes.STRING(20),
            unique: true
        },
        parent_unit_id: {
            type: DataTypes.INTEGER
        },
        manager_id: DataTypes.INTEGER,
        location_id: DataTypes.INTEGER,
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'business_units',
        timestamps: true
    });

    BusinessUnit.associate = function (models) {
        BusinessUnit.belongsTo(models.BusinessUnit, {
            as: 'parentUnit',
            foreignKey: 'parent_unit_id',
            onDelete: 'SET NULL'
        });
    };

    return BusinessUnit;
};
