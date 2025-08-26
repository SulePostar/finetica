const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Import models to fetch user data if needed
const JWT_SECRET = process.env.JWT_SECRET;
// Function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expired!' });
  }
};
// Function to authorize admin users
const authorizeAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (req.user.roleId === 1) {
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
module.exports = {
  verifyToken,
  authorizeAdmin,
};