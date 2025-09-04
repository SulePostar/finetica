const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class KifProcessingLog extends Model { }

    KifProcessingLog.init(
        {
            filename: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            isProcessed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            processedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isValid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'KifProcessingLog',
            tableName: 'kif_processing_logs',
            timestamps: true,
            underscored: true,
        }
    );

    return KifProcessingLog;
};