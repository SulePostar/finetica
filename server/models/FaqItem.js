const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class FaqItem extends Model { }

    FaqItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            categoryKey: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'category_key', // Maps JS 'categoryKey' to DB 'category_key'
                comment: 'Links to frontend config keys like "getting-started"'
            },
            question: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            answer: {
                type: DataTypes.TEXT, // Using TEXT for longer content
                allowNull: false,
            },
            displayOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                field: 'display_order',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            },
        },
        {
            sequelize,
            modelName: 'FaqItem',
            tableName: 'faq_items', // Explicit snake_case table name
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true
        }
    );

    return FaqItem;
};