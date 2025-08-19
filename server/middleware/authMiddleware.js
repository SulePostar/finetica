const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Import models to fetch user data if needed
const JWT_SECRET = process.env.JWT_SECRET;

// Function to authorize admin users
module.exports = function authorizeAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Decoded token:', decoded);
    console.log('Role name from token:', decoded.roleName);
    console.log('User ID from token:', decoded.userId);

    // Check if user has admin role using roleName from token
    // Allow both 'admin' and 'Admin' (case-insensitive check)
    const userRole = decoded.roleName?.toLowerCase();
    if (userRole === 'admin' || userRole === 'administrator') {
      return next();
    } else {
      console.log('Access denied - Role:', decoded.roleName); // Debug log
      return res.status(403).json({ message: 'Access denied! Admin only!' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Token expired!' });
  }
};