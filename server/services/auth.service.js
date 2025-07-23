const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const LoginUserDTO = require('../dto/auth/requests/LoginUserDTO');
const RegisterUserDTO = require('../dto/auth/requests/RegisterUserDTO');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
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
        ],
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      if (!user.is_active) {
        return {
          success: false,
          message: 'Account is deactivated',
        };
      }

      if (user.approval_status !== 'accepted') {
        const statusMessages = {
          pending: 'Account is pending admin approval',
          rejected: 'Account has been rejected by admin',
        };

        return {
          success: false,
          message: statusMessages[user.approval_status] || 'Account approval status invalid',
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

      const token = this.generateToken(user.id);

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

      const userWithRole = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Registration successful',
        data: {
          user: userWithRole,
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
      const user = await User.findByPk(userId);

      if (!user || !user.is_active) {
        return {
          success: false,
          message: 'Invalid user',
        };
      }

      const token = this.generateToken(userId);

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
            attributes: ['id', 'name', 'description'],
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
