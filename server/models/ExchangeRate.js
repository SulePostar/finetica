const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    ExchangeRate.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                unique: true
            },
            base: {
                type: DataTypes.STRING(3),
                allowNull: false
            },
            rates: {
                type: DataTypes.JSONB,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ExchangeRate',
            tableName: 'exchange_rates',
            timestamps: true,
            underscored: true
        }
    );

    return ExchangeRate;
};