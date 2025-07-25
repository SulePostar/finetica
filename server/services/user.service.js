const { User, Role, UserStatus } = require('../models');
const getAllUsers = async () => {
  return await User.findAll({
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
};
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
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
    throw new Error('User not found');
  }
  return user;
};
const updateUser = async (id, dto, isAdmin = false) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  // Check for email uniqueness if email is being updated
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
      // Validate role exists if role_id is provided
      if (dto.role_id !== null) {
        const role = await Role.findByPk(dto.role_id);
        if (!role) {
          throw new Error('Invalid role selected');
        }
      }
      user.role_id = dto.role_id;
    }
    // Note: is_active field has been removed, status is now managed through UserStatus
  }
  await user.save();
  // Return user with role and status information
  return await User.findByPk(user.id, {
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
};
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  await user.destroy();
  return { message: 'User deleted successfully' };
};
const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email: email.toLowerCase() },
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
    throw new Error('User not found');
  }
  return user;
};
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
