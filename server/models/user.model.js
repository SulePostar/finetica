'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
      });
    }
  }
  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passHash: { type: DataTypes.STRING, allowNull: false },
      profileImage: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      isEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
