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

const getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.user.id);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Refresh token controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while refreshing token',
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.',
    });
  } catch (error) {
    console.error('Logout controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout',
    });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const result = await authService.getPendingUsers();
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Get pending users controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching pending users',
    });
  }
};

const _handleUserAction = async (req, res, action, actionName) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await action(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error(`${actionName} controller error:`, error);
    return res.status(500).json({
      success: false,
      message: `Server error while ${actionName.toLowerCase()}`,
    });
  }
};

const approveUser = (req, res) =>
  _handleUserAction(req, res, authService.approveUser.bind(authService), 'Approve user');

const rejectUser = (req, res) =>
  _handleUserAction(req, res, authService.rejectUser.bind(authService), 'Reject user');

module.exports = {
  login,
  register,
  getProfile,
  refreshToken,
  logout,
  getPendingUsers,
  approveUser,
  rejectUser,
};
