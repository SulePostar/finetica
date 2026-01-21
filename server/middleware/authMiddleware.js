const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token!' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expired or invalid!' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.roleId === 1) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied! Admin only!' });
  }
};

module.exports = {
  verifyToken,
  authorizeAdmin,
};