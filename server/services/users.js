const { User, Role, UserStatus } = require('../models');

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
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id, dto, isAdmin = false) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Email uniqueness check
    if (dto.email && dto.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: dto.email.toLowerCase() },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    user.first_name = dto.first_name ?? user.first_name;
    user.last_name = dto.last_name ?? user.last_name;
    user.email = dto.email ? dto.email.toLowerCase() : user.email;

    if (isAdmin) {
      if (dto.role_id !== undefined) {
        if (dto.role_id !== null) {
          const role = await Role.findByPk(dto.role_id);
          if (!role) {
            throw new Error('Invalid role selected');
          }
        }
        user.role_id = dto.role_id;
      }

      if (dto.status_id !== undefined) {
        if (dto.status_id !== null) {
          const status = await UserStatus.findByPk(dto.status_id);
          if (!status) {
            throw new Error('Invalid status selected');
          }
        }
        user.status_id = dto.status_id;
      }
    }

    await user.save();

    return await User.findByPk(user.id, {
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

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
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
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
