const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authMiddleware');

router.use((req, _res, next) => {
    req.user = {
        id: 5,
        username: 'testuser',
        role: 'user',
        role_id: 2
    };
    next();
});

router.get('/admin', authorizeRole, (_req, res) => {
    res.json({ message: 'Dobrodošao, admin!' });
});

module.exports = router;