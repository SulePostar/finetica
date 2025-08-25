const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class KufProcessedFile extends Model {
        static associate(models) {
            // Define associations here if needed in the future
        }

        /**
         * Mark a file as processed
         */
        async markAsProcessed(errorMessage = null) {
            return this.update({
                processed: true,
                processedAt: new Date(),
                errorMessage: errorMessage
            });
        }

        /**
         * Mark a file as failed
         */
        async markAsFailed(errorMessage) {
            return this.update({
                processed: false,
                errorMessage: errorMessage,
                processedAt: new Date()
            });
        }

        /**
         * Reset processing status
         */
        async resetProcessing() {
            return this.update({
                processed: false,
                processedAt: null,
                errorMessage: null
            });
        }
    }

    KufProcessedFile.init(
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
            processed: {
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
            modelName: 'KufProcessedFile',
            tableName: 'kuf_processed_files',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['file_name']
                },
                {
                    fields: ['processed']
                }
            ]
        }
    );

    return KufProcessedFile;
};