const { User, Role, UserStatus } = require('../models');
const AppError = require('../utils/errorHandler');

class UserService {
  async getAllUsers() {
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
      ],
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

    console.log(
      'Users from database:',
      users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        roleId: u.roleId,
        role: u.role,
      }))
    );

    return users;
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

  async updateUserByAdmin(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update user with provided data
    await user.update(updateData);

    // Return updated user with associations
    return await this.getUserById(id);
  }

  async deleteUserByAdmin(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  async getUserStats() {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isEnabled: true } });
    const inactiveUsers = await User.count({ where: { isEnabled: false } });

    const usersByRole = await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['roleId', [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']],
      group: ['roleId', 'role.id', 'role.name'],
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole: usersByRole.map((item) => ({
        role: item.role?.name || 'Unknown',
        count: parseInt(item.dataValues.count),
      })),
    };
  }
}

module.exports = new UserService();
