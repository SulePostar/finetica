const jwt = require('jsonwebtoken'); // ← Add this line
const authService = require('../services/authentication');
const activityLogService = require('../services/activityLogService');

const REFRESH_TOKEN_MAX_AGE = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, req.clientInfo);
    attachCookiesToResponse(res, result.data.refreshToken);
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
  try {
    // Log logout activity if we have user info from the token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the logout activity
        await activityLogService.logActivity({
          userId: decoded.userId,
          action: 'logout',
          entity: 'User',
          entityId: decoded.userId,
          details: {
            method: 'token_invalidation',
            role: decoded.roleName || 'unknown',
          },
          ipAddress: req.clientInfo?.ipAddress,
          userAgent: req.clientInfo?.userAgent,
          status: 'success',
        });
      } catch (error) {
        console.log('Token verification failed during logout:', error.message);
      }
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

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, new_password } = req.body;
    const result = await authService.resetPassword(token, new_password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const attachCookiesToResponse = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/api/auth',
    sameSite: 'strict'
  });
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
};