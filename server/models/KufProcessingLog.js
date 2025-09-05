const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class KufProcessingLog extends Model { }

    KufProcessingLog.init(
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
            modelName: 'KufProcessingLog',
            tableName: 'kuf_processing_logs',
            timestamps: true,
            underscored: true,
        }
    );

    return KufProcessingLog;
};
