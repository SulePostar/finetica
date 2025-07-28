const { User, Role, UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');

class UserService {
  async getAllUsers() {
    return await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
        {
          model: UserStatus,
          as: 'user_status',
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
          attributes: ['id', 'name'],
        },
        {
          model: UserStatus,
          as: 'user_status',
          attributes: ['id', 'status'],
        },
      ],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

module.exports = new UserService();
