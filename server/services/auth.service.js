const jwt = require('jsonwebtoken');
const { User, Role, UserStatus } = require('../models');
const LoginUserDTO = require('../dto/auth/requests/LoginUserDTO');
const RegisterUserDTO = require('../dto/auth/requests/RegisterUserDTO');
class AuthService {
  generateToken(userId, roleId = null, roleName = null) {
    const payload = { userId };
    if (roleId && roleName) {
      payload.roleId = roleId;
      payload.roleName = roleName;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }
  async login(loginData) {
    try {
      const loginDTO = new LoginUserDTO(loginData);
      const validation = loginDTO.validate();
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        };
      }
      const user = await User.scope('withPassword').findOne({
        where: { email: loginDTO.email.toLowerCase() },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      });
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      // Check user status - only approved users can login
      if (!user.user_status) {
        return {
          success: false,
          message: 'User status not found',
        };
      }
      if (user.user_status.status === 'pending') {
        return {
          success: false,
          message: 'Account is pending admin approval and cannot login',
        };
      }
      if (user.user_status.status === 'rejected') {
        return {
          success: false,
          message: 'Account has been rejected by admin',
        };
      }
      if (user.user_status.status === 'deleted') {
        return {
          success: false,
          message: 'Account has been deleted',
        };
      }
      if (user.user_status.status !== 'approved') {
        return {
          success: false,
          message: 'Account approval status invalid',
        };
      }
      const isPasswordValid = await user.checkPassword(loginDTO.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
      await user.update({ last_login_at: new Date() });
      const token = this.generateToken(user.id, user.role?.id, user.role?.name);
      const userResponse = user.toJSON();
      delete userResponse.password_hash;
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }
  async register(registerData) {
    try {
      const registerDTO = new RegisterUserDTO(registerData);
      const validation = registerDTO.validate();
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        };
      }
      const existingUser = await User.findOne({
        where: { email: registerDTO.email.toLowerCase() },
      });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }
      if (registerDTO.role_id !== null) {
        const role = await Role.findByPk(registerDTO.role_id);
        if (!role) {
          return {
            success: false,
            message: 'Invalid role selected',
          };
        }
      }
      const userData = registerDTO.toModelData();
      const user = await User.create(userData);
      const userWithRelations = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      });
      // Don't provide JWT token for pending users
      if (userWithRelations.user_status.status === 'pending') {
        return {
          success: true,
          message: 'Registration successful. Your account is pending admin approval.',
          data: {
            user: userWithRelations,
            // No token provided for pending users
          },
        };
      }
      // Only provide token if user is already approved (shouldn't happen with current flow, but keeping for safety)
      const token = this.generateToken(
        user.id,
        userWithRelations.role?.id,
        userWithRelations.role?.name
      );
      return {
        success: true,
        message: 'Registration successful',
        data: {
          user: userWithRelations,
          token,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }
      return {
        success: false,
        message: 'An error occurred during registration',
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
            attributes: ['id', 'name', 'description'],
          },
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
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
  async refreshToken(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      });
      if (!user) {
        return {
          success: false,
          message: 'Invalid user',
        };
      }
      // Check user status for refresh token as well
      if (!user.user_status || user.user_status.status !== 'approved') {
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
      const pendingStatus = await UserStatus.findOne({ where: { status: 'pending' } });
      if (!pendingStatus) {
        return {
          success: false,
          message: 'Pending status not found',
        };
      }
      const pendingUsers = await User.findAll({
        where: { status_id: pendingStatus.id },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
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
      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      if (user.user_status.status === 'approved') {
        return {
          success: false,
          message: 'User is already approved',
        };
      }
      const approvedStatus = await UserStatus.findOne({ where: { status: 'approved' } });
      if (!approvedStatus) {
        return {
          success: false,
          message: 'Approved status not found',
        };
      }
      await user.update({ status_id: approvedStatus.id });
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
      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserStatus,
            as: 'user_status',
            attributes: ['id', 'status'],
          },
        ],
      });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      if (user.user_status.status === 'rejected') {
        return {
          success: false,
          message: 'User is already rejected',
        };
      }
      const rejectedStatus = await UserStatus.findOne({ where: { status: 'rejected' } });
      if (!rejectedStatus) {
        return {
          success: false,
          message: 'Rejected status not found',
        };
      }
      await user.update({ status_id: rejectedStatus.id });
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
