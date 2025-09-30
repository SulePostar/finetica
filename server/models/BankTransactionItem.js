const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class BankTransactionItem extends Model {
        static associate({ BankTransaction }) {
            // Each item belongs to one BankTransaction (the statement/parent record)
            BankTransactionItem.belongsTo(BankTransaction, { foreignKey: 'transactionId' });
        }
    }

    BankTransactionItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            // Bank details
            bankName: {
                field: 'bank_name',
                type: DataTypes.STRING,
                allowNull: true,
            },
            accountNumber: {
                field: 'account_number',
                type: DataTypes.STRING,
                allowNull: true,
            },

            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            direction: {
                type: DataTypes.ENUM('in', 'out'),
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },

            // Extra details from statement line
            currency: {
                type: DataTypes.STRING(3), // e.g., "EUR", "BAM"
                allowNull: true,
            },
            referenceNumber: {
                field: 'reference_number',
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // Link to parent transaction (statement file summary)
            transactionId: {
                field: 'transaction_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'BankTransactionItem',
            tableName: 'bank_transaction_items',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true,
        }
    );

    return BankTransactionItem;
};
