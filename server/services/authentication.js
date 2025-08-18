const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role, UserStatus } = require('../models');

const AppError = require('../utils/errorHandler');
const { USER_STATUS } = require('../utils/constants');
const activityLogService = require('./activityLogService');

class AuthService {
  async register(registerData, clientInfo = {}) {
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

    // Log user registration
    await activityLogService.logActivity({
      userId: user.id,
      action: 'register',
      entity: 'User',
      entityId: user.id,
      details: {
        email: user.email,
        roleId: user.roleId,
        statusId: user.statusId,
      },
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      status: 'success',
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
          profileImage: user.profileImage,
          roleId: user.roleId,
          roleName: user.role?.role || null,
          statusId: user.statusId,
        },
      },
    };
  }

  async login(loginData, clientInfo = {}) {
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

    // Log successful login
    await activityLogService.logActivity({
      userId: user.id,
      action: 'login',
      entity: 'User',
      entityId: user.id,
      details: {
        method: 'email_password',
        role: user.role?.role,
        status: user.status?.status,
      },
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      status: 'success',
    });

    const token = this.#generateToken(user.id, user.role?.id, user.role?.role);

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
        token,
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
          attributes: ['id', 'role'],
        },
      ],
    });

    if (!user || !user.is_active || user.statusId !== USER_STATUS.APPROVED) {
      throw new AppError('Invalid user or account status', 403);
    }

    const token = this.#generateToken(userId, user.role?.id, user.role?.name);

    // Log token refresh
    await activityLogService.logActivity({
      userId: userId,
      action: 'token_refresh',
      entity: 'User',
      entityId: userId,
      details: {
        method: 'jwt_refresh',
      },
      status: 'success',
    });

    return {
      success: true,
      data: { token },
    };
  }
}

module.exports = new AuthService();
