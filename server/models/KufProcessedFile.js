const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class KufProcessedFile extends Model { }

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