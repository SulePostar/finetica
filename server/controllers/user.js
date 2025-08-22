const userService = require('../services/users');
const { UserResponseDTO } = require('../dto/user/responses/UserResponseDTO.js');
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users.map((user) => new UserResponseDTO(user)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(new UserResponseDTO(user));
  } catch (error) {
    next(error);
  }
};
const editMyProfile = async (req, res, next) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'User ID is required in request body' });
  }
  try {
    const { id, ...updateData } = req.body;
    const updatedUser = await userService.updateProfile(id, updateData);
    res.json(new UserResponseDTO(updatedUser));
  } catch (error) {
    next(error);
  }
};
// Admin functions
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(new UserResponseDTO(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Validate status if provided
    if (updateData.statusId && ![1, 2, 3, 4].includes(updateData.statusId)) {
      return res.status(400).json({
        error: 'Invalid status ID. Must be 1 (pending), 2 (approved), 3 (rejected), or 4 (deleted)',
      });
    }
    // Validate role if provided
    if (
      updateData.roleId !== null &&
      updateData.roleId !== undefined &&
      ![1, 2, 3].includes(updateData.roleId)
    ) {
      return res.status(400).json({
        error: 'Invalid role ID. Must be 1 (guest), 2 (user), or 3 (admin)',
      });
    }
    const user = await userService.updateUserByAdmin(id, updateData);
    res.json(new UserResponseDTO(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUserByAdmin(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  editMyProfile,
}; 