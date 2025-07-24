module.exports = function authorizeRole(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Nije autentifikovan korisnik' });
    }

    if (req.user.role === 'admin' || req.user.role_id === 1) {
        return next();
    }

    return res.status(403).json({ message: 'Pristup odbijen: nije admin' });
};
