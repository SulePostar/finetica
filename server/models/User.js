'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Role, UserStatus }) {
      User.belongsTo(Role, {
        foreignKey: 'roleId',
        as: 'role',
      });

      User.belongsTo(UserStatus, {
        foreignKey: 'statusId',
        as: 'status',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      profileImage: {
        type: DataTypes.STRING,
        field: 'profile_image',
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allowed null here because some users may not have a role assigned initially
        defaultValue: null,
        field: 'role_id',
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'status_id',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_email_verified',
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_enabled',
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'verification_token',
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'password_reset_token',
      },
      resetExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_expires_at',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
