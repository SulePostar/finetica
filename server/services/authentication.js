const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role, UserStatus } = require('../models');
const LoginUserDTO = require('../dto/auth/requests/LoginUserDTO');
const RegisterUserDTO = require('../dto/auth/requests/RegisterUserDTO');
const AppError = require('../utils/errorHandler');

class AuthService {
  async register(registerData) {
    const registerDTO = new RegisterUserDTO(registerData);
    const validation = registerDTO.validate();

    if (!validation.isValid) {
      throw new AppError('Validation failed', 400, validation.errors);
    }

    const existingUser = await User.findOne({
      where: { email: registerDTO.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const userData = registerDTO.toModelData();

    userData.passwordHash = await bcrypt.hash(userData.password, 10);

    userData.statusId = 1;

    const user = await User.create(userData);

    const userWithRole = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
        {
          model: UserStatus,
          as: 'userStatus',
          attributes: ['id', 'status'],
        },
      ],
    });

    return {
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      data: { user: userWithRole },
    };
  }

  async login(loginData) {
    try {
      const loginDTO = new LoginUserDTO(loginData);
      const validation = loginDTO.validate();
      if (!validation.isValid) throw new AppError('Validation failed', 400);

      const user = await User.scope('withPassword').findOne({
        where: { email: loginDTO.email.toLowerCase() },
        include: [
          { model: Role, as: 'role', attributes: ['id', 'name'] },
          { model: UserStatus, as: 'userStatus', attributes: ['id', 'status'] },
        ],
      });

      if (!user) throw new AppError('Invalid credentials', 401);

      if (user.statusId === 4) throw new AppError('Account deactivated', 403);

      if (user.statusId !== 2) {
        const statusMessages = {
          1: 'Account is pending admin approval and cannot login',
          3: 'Account has been rejected by admin',
        };
        throw new AppError(statusMessages[user.statusId] || 'Invalid account status', 403);
      }

      const isPasswordValid = await user.checkPassword(loginDTO.password);
      if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

      await user.update({ lastLoginAt: new Date() });

      const token = this.generateToken(user.id, user.role?.id, user.role?.name);

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
            roleName: user.role?.name || '',
            statusId: user.statusId,
            statusName: user.userStatus?.status || '',
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          token,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  }

  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
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
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching profile',
      };
    }
  }

  generateToken(userId, roleId = null, roleName = null) {
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
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!user || !user.is_active) {
        return {
          success: false,
          message: 'Invalid user',
        };
      }

      // Check approval status for refresh token as well
      if (user.approval_status !== 'accepted') {
        return {
          success: false,
          message: 'Account is not approved',
        };
      }

      const token = this.generateToken(userId, user.role?.id, user.role?.name);

      return {
        success: true,
        data: { token },
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'An error occurred while refreshing token',
      };
    }
  }

  async getPendingUsers() {
    try {
      const pendingUsers = await User.findAll({
        where: { approval_status: 'pending' },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        ],
        order: [['created_at', 'ASC']],
      });

      return {
        success: true,
        data: { users: pendingUsers },
      };
    } catch (error) {
      console.error('Get pending users error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching pending users',
      };
    }
  }

  async approveUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (user.approval_status === 'accepted') {
        return {
          success: false,
          message: 'User is already approved',
        };
      }

      await user.update({ approval_status: 'accepted' });

      return {
        success: true,
        message: 'User approved successfully',
        data: { user },
      };
    } catch (error) {
      console.error('Approve user error:', error);
      return {
        success: false,
        message: 'An error occurred while approving user',
      };
    }
  }

  async rejectUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (user.approval_status === 'rejected') {
        return {
          success: false,
          message: 'User is already rejected',
        };
      }

      await user.update({ approval_status: 'rejected' });

      return {
        success: true,
        message: 'User rejected successfully',
        data: { user },
      };
    } catch (error) {
      console.error('Reject user error:', error);
      return {
        success: false,
        message: 'An error occurred while rejecting user',
      };
    }
  }
}

module.exports = new AuthService();
