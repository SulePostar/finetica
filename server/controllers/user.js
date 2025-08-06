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


module.exports = {
  getAllUsers,
  getMyProfile,
  editMyProfile,
};
