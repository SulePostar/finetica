const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class BankTransactionProcessedFile extends Model { }

    BankTransactionProcessedFile.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'file_name',
            },
            isProcessed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        },
        {
            sequelize,
            modelName: 'BankTransactionProcessedFile',
            tableName: 'bank_transaction_processed_files',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true
        }
    );

    return BankTransactionProcessedFile;
};