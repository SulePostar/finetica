// services/users.js
const { User, Role, UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');
const { UserResponseDTO } = require('../dto/user/responses/UserResponseDTO.js');

class UserService {
  async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'roleId',
          'statusId',
          ['created_at', 'createdAt'],
          ['updated_at', 'updatedAt'],
          ['last_login_at', 'lastLoginAt']
        ],
        include: [
          { model: Role, as: 'role', attributes: ['id', 'role'] },
          { model: UserStatus, as: 'status', attributes: ['id', 'status'] },
        ],
      });

      return users.map((user) => new UserResponseDTO(user));
    } catch (error) {
      throw new AppError(`Failed to fetch users: ${error.message}`, 500);
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Role, as: 'role', attributes: ['id', 'role'] },
          { model: UserStatus, as: 'status', attributes: ['id', 'status'] },
        ],
      });

      if (!user) throw new AppError('User not found', 404);
      return new UserResponseDTO(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to fetch user: ${error.message}`, 500);
    }
  }

  async updateUser(id, updateData) {
    try {
      // Validate role
      if (updateData.roleId !== null && updateData.roleId !== undefined) {
        const role = await Role.findByPk(updateData.roleId);
        if (!role) throw new AppError(`Invalid role ID: ${updateData.roleId}`, 400);
      }

      // Validate status
      if (updateData.statusId) {
        const status = await UserStatus.findByPk(updateData.statusId);
        if (!status) throw new AppError(`Invalid status ID: ${updateData.statusId}`, 400);
      }

      const user = await User.findByPk(id);
      if (!user) throw new AppError('User not found', 404);

      await user.update(updateData);
      const updatedUser = await this.getUserById(id);
      return updatedUser; // Already a DTO
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to update user: ${error.message}`, 500);
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) throw new AppError('User not found', 404);

      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to delete user: ${error.message}`, 500);
    }
  }

  async updateProfile(updatedData) {
    try {
      const user = await User.findByPk(updatedData.id);
      if (!user) throw new AppError('User not found', 404);

      const allowedFields = ['firstName', 'lastName', 'email', 'profileImage'];
      allowedFields.forEach((field) => {
        if (updatedData[field] !== undefined) {
          user[field] = updatedData[field];
        }
      });

      await user.save();
      const updatedUser = await this.getUserById(updatedData.id);
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to update profile: ${error.message}`, 500);
    }
  }
}

module.exports = new UserService();
