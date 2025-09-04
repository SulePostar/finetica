const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class BankTransactionProcessingLog extends Model { }

    BankTransactionProcessingLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            filename: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            isProcessed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_processed',
            },
            processedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'processed_at',
            },
            errorMessage: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'error_message',
            },
            is_valid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'BankTransactionProcessingLog',
            tableName: 'bank_transaction_processing_logs',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true
        }
    );

    return BankTransactionProcessingLog;
};