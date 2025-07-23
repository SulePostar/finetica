const userService = require("../services/user.service.js");
const { UserResponseDTO } = require("../dto/user/responses/UserResponseDTO.js");
const {
  UserUpdateRequestDTO,
  AdminUpdateUserDTO,
} = require("../dto/user/requests/UserRequestDTO.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users.map((user) => new UserResponseDTO(user)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(new UserResponseDTO(user));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(new UserResponseDTO(user));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const dto = new UserUpdateRequestDTO(req.body);
    const updated = await userService.updateUser(req.user.id, dto);
    res.json(new UserResponseDTO(updated));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const dto = new AdminUpdateUserDTO(req.body);
    const updated = await userService.updateUser(req.params.id, dto, true);
    res.json(new UserResponseDTO(updated));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.user.id);
    res.clearCookie("token");
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(new UserResponseDTO(user));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateMyProfile,
  updateUserByAdmin,
  deleteMyAccount,
  deleteUserByAdmin,
  getUserByEmail
};