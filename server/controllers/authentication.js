const authService = require('../services/authentication');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
