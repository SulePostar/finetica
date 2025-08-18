const authService = require('../services/authentication');
const activityLogService = require('../services/activityLogService');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, req.clientInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body, req.clientInfo);
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
  try {
    // Log logout activity
    if (req.user && req.user.userId) {
      await activityLogService.logActivity({
        userId: req.user.userId,
        action: 'logout',
        entity: 'User',
        entityId: req.user.userId,
        details: {
          method: 'token_invalidation',
        },
        status: 'success',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.',
    });
  } catch (error) {
    // Don't fail logout if logging fails
    console.error('Failed to log logout activity:', error);
    return res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.',
    });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
