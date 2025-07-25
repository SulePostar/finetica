'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async checkPassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }

    getFullName() {
      if (this.first_name && this.last_name) {
        return `${this.first_name} ${this.last_name}`;
      }
      return this.first_name || this.last_name || 'User';
    }

    async hasRole(roleName) {
      const role = await this.getRole();
      return role && role.name === roleName;
    }

    async isAdmin() {
      return this.hasRole('admin');
    }

    async isUser() {
      return this.hasRole('user');
    }

    async isGuest() {
      return this.hasRole('guest');
    }

    isPending() {
      const status = this.UserStatus || this.user_status;
      return status && status.status === 'pending';
    }

    isApproved() {
      const status = this.UserStatus || this.user_status;
      return status && status.status === 'approved';
    }

    isRejected() {
      const status = this.UserStatus || this.user_status;
      return status && status.status === 'rejected';
    }

    isDeleted() {
      const status = this.UserStatus || this.user_status;
      return status && status.status === 'deleted';
    }

    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });

      User.belongsTo(models.UserStatus, {
        foreignKey: 'status_id',
        as: 'user_status',
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
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        defaultValue: null,
        references: {
          model: 'user_roles',
          key: 'id',
        },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default to 'pending' status
        references: {
          model: 'user_statuses',
          key: 'id',
        },
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password_hash'] },
        include: [
          {
            model: sequelize.models.Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
          {
            model: sequelize.models.UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password_hash'] },
        },
        withoutRole: {
          attributes: { exclude: ['password_hash'] },
          include: [],
        },
        active: {
          include: [
            {
              model: sequelize.models.UserStatus,
              as: 'user_status',
              where: { status: 'approved' },
            },
          ],
        },
        verified: {
          where: { is_email_verified: true },
        },
        byRole: (roleName) => ({
          include: [
            {
              model: sequelize.models.Role,
              as: 'role',
              where: { name: roleName },
            },
          ],
        }),
      },
    }
  );

  return User;
};
