const { User, Role, UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');

class UserService {
  async getAllUsers() {
    return await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'role'],
        },
        {
          model: UserStatus,
          as: 'status',
          attributes: ['id', 'status'],
        },
      ],
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'role'],
        },
        {
          model: UserStatus,
          as: 'status',
          attributes: ['id', 'status'],
        },
      ],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(id, updatedData) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('User not found', 404);

    const allowedFields = ['firstName', 'lastName', 'email'];
    allowedFields.forEach((field) => {
      if (updatedData[field] !== undefined) {
        user[field] = updatedData[field];
      }
    });

    await user.save();

    return await this.getUserById(id);
  }

}

module.exports = new UserService();
