'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserStatus extends Model {
    static associate(models) {
      UserStatus.hasMany(models.User, {
        foreignKey: 'status_id',
        as: 'users',
      });
    }
  }

  UserStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'UserStatus',
      tableName: 'user_statuses',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserStatus;
};
