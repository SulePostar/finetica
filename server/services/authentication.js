const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role, UserStatus } = require('../models');

const AppError = require('../utils/errorHandler');
const { USER_STATUS } = require('../utils/constants');

class AuthService {
  async register(registerData) {
    const { email, password, ...rest } = registerData;
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(registerData.password, 10);

    const user = await User.create({
      email,
      passwordHash,
      ...rest,
      statusId: USER_STATUS.PENDING,
    });

    return {
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role?.name || null,
          statusId: user.statusId,
        },
      },
    };
  }

  async login(loginData) {
    const { email, password } = loginData;
    const user = await User.scope('withPassword').findOne({
      where: { email },
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name'] },
        { model: UserStatus, as: 'userStatus', attributes: ['id', 'status'] },
      ],
    });

    if (!user) throw new AppError('Invalid credentials', 401);

    if (user.statusId === USER_STATUS.DELETED) throw new AppError('Account deactivated', 403);

    if (user.statusId !== USER_STATUS.APPROVED) {
      const statusMessages = {
        1: 'Account is pending admin approval and cannot login',
        3: 'Account has been rejected by admin',
      };
      throw new AppError(statusMessages[user.statusId] || 'Invalid account status', 403);
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

    await user.update({ lastLoginAt: new Date() });

    const token = this.#generateToken(user.id, user.role?.id, user.role?.name);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role?.name || null,
          statusId: user.statusId,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
        },
        token,
      },
    };
  }

  #generateToken(userId, roleId = null, roleName = null) {
    const payload = { userId };

    if (roleId && roleName) {
      payload.roleId = roleId;
      payload.roleName = roleName;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async refreshToken(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user || !user.is_active || user.statusId !== USER_STATUS.APPROVED) {
      throw new AppError('Invalid user or account status', 403);
    }

    const token = this.#generateToken(userId, user.role?.id, user.role?.name);

    return {
      success: true,
      data: { token },
    };
  }
}

module.exports = new AuthService();
