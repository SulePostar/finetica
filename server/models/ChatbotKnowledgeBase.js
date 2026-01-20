'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ChatbotKnowledgeBase extends Model {
        static associate(models) {
            ChatbotKnowledgeBase.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    ChatbotKnowledgeBase.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            session_id: {
                type: DataTypes.STRING,
                allowNull: true,
                index: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            question: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            answer: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending',
            },
            files_used: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
                defaultValue: [],
            },
            embedding: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'ChatbotKnowledgeBase',
            tableName: 'chatbot_knowledge_base',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true,
        }
    );

    return ChatbotKnowledgeBase;
};