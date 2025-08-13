const authService = require('../services/authentication');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    attachCookiesToResponse(res, result.data.refreshToken);
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

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.rotateTokens(refreshToken);
    attachCookiesToResponse(res, result.data.refreshToken);
    return res.status(200).json({ token: result.data.token });
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

const attachCookiesToResponse = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
    sameSite: 'strict'
  });
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
