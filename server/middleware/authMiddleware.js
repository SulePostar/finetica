const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = function authorizeRole(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token nije dostavljen' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (req.user.role === 'admin' || req.user.role_id === 1) {
            return next();
        } else {
            return res.status(403).json({ message: 'Pristup odbijen: nije admin' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Nevažeći token' });
    }
};
