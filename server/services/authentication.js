const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Role, UserStatus, RefreshToken } = require('../models');

const AppError = require('../utils/errorHandler');
const { USER_STATUS } = require('../utils/constants');

class AuthService {
  async register(registerData) {
    const { email, password, profileImage, ...rest } = registerData;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      email,
      passwordHash,
      ...rest,
      statusId: USER_STATUS.PENDING,
    };

    // Add profile image if provided
    if (profileImage) {
      userData.profileImage = profileImage;
    }

    const user = await User.create(userData);

    return {
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage,
          roleId: user.roleId,
          roleName: user.role?.role || null,
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
        { model: Role, as: 'role', attributes: ['id', 'role'] },
        { model: UserStatus, as: 'status', attributes: ['id', 'status'] },
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

    const { newAccessToken, newRefreshToken } = await this.#generateTokens(user);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          fullName: user.firstName + ' ' + user.lastName,
          email: user.email,
          roleId: user.roleId,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          roleName: user.role?.role || '',
          statusId: user.statusId,
          statusName: user.status?.status || '',
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: newAccessToken,
        refreshToken: newRefreshToken
      },
    };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'role'],
        },
      ],
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      data: { user },
    };
  }

  async #generateTokens(user) {
    const payload = { userId: user.id };

    if (user.role?.id && user.role?.role) {
      payload.roleId = user.role.id;
      payload.roleName = user.role.role;
    }

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const newRefreshToken = crypto.randomBytes(32).toString('base64url');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await RefreshToken.create({
      tokenHash: newRefreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { newAccessToken, newRefreshToken };
  }

  async rotateTokens(token) {
    if (!token) throw new AppError('Unauthorized', 401);

    const refreshToken = await RefreshToken.findOne({
      where: { tokenHash: crypto.createHash('sha256').update(token).digest('hex') },
      include: [{ model: User, as: 'user' }],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) throw new AppError('Unauthorized', 401);

    const user = refreshToken.user;


    await refreshToken.destroy();
    const { newAccessToken, newRefreshToken } = await this.#generateTokens(user);
    return {
      success: true,
      data: { token: newAccessToken, refreshToken: newRefreshToken },
    };
  }
}

module.exports = new AuthService();
