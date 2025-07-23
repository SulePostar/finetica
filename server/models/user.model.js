'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
      });
    }
    toJSON() {
      const values = this.get();

      delete values.passHash;
      delete values.resetToken;
      delete values.resetTokenExpiry;
      delete values.isEnabled;
      delete values.createdAt;
      delete values.updatedAt;

      return values;
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
      resetToken: { type: DataTypes.STRING },
      resetTokenExpiry: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.passHash) {
            const saltRounds = 10;
            user.passHash = await bcrypt.hash(user.passHash, saltRounds);
          }
        },
      },
    }
  );
  return User;
};
