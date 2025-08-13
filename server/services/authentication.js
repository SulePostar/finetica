const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role, UserStatus } = require('../models');
const { sendTemplatedEmail } = require('./mailService');

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

    // Send welcome email
    try {
      await sendTemplatedEmail('welcome_email', user.email, {
        userName: user.firstName
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

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

  async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Store reset token and expiry
    await user.update({
      passwordResetToken: resetToken,
      resetExpiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    // Send password reset email
    try {
      await sendTemplatedEmail('reset_password_email', user.email, {
        resetLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      throw new AppError('Failed to send password reset email', 500);
    }

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };
  }

  async resetPassword(token, new_password) {
    try {
      if (!token || !new_password) {
        throw new AppError('Token and new password are required', 400);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, userId:', decoded.userId, 'type:', decoded.type);

      if (decoded.type !== 'password_reset') {
        throw new AppError('Invalid token type', 400);
      }

      const user = await User.scope('withPassword').findOne({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      console.log('User found:', user.id, 'has resetToken:', !!user.passwordResetToken, 'resetExpiresAt:', user.resetExpiresAt);

      if (!user.passwordResetToken || user.passwordResetToken !== token) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      if (user.resetExpiresAt < new Date()) {
        throw new AppError('Reset token has expired', 400);
      }

      // Update password and clear reset token
      const passwordHash = await bcrypt.hash(new_password, 10);
      console.log('Password hashed successfully, updating user...');

      await user.update({
        passwordHash,
        passwordResetToken: null,
        resetExpiresAt: null
      });

      console.log('User updated successfully');

      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('Error in resetPassword:', error);

      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid reset token', 400);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Reset token has expired', 400);
      }

      // Re-throw AppError instances as-is
      if (error instanceof AppError) {
        throw error;
      }

      // For any other errors, throw a generic error
      throw new AppError('Something went wrong', 500);
    }
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

    if (!user || user.statusId !== USER_STATUS.APPROVED) {
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
