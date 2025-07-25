const jwt = require('jsonwebtoken');
const { User, UserStatus } = require('../models');
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }
    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.scope('withoutRole').findByPk(decoded.userId, {
      include: [
        {
          model: require('../models').Role,
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
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }
    // Check user status - only approved users can access protected routes
    if (!user.user_status) {
      return res.status(401).json({
        success: false,
        message: 'User status not found',
      });
    }
    if (user.user_status.status !== 'approved') {
      const statusMessages = {
        pending: 'Account is pending admin approval',
        rejected: 'Account has been rejected by admin',
        deleted: 'Account has been deleted',
      };
      return res.status(401).json({
        success: false,
        message: statusMessages[user.user_status.status] || 'Account is not approved',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userRole = req.user.role.name;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }
    next();
  };
};
module.exports = {
  authMiddleware,
  requireRole,
};
