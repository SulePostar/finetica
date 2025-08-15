const hasRole = (allowedRoles) => {
    return (req, res, next) => {
        const { roleName } = req.user;

        if (!roleName) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const isAllowed = allowedRoles.includes(roleName);

        if (!isAllowed) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

module.exports = hasRole;