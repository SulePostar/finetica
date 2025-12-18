// controllers/users.js
const userService = require('../services/users');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserById(req.user.userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const editMyProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  editMyProfile,
  getUserById,
  updateUser,
  deleteUser
};
