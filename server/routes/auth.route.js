const express = require('express');
const { login, register, logout } = require('../controllers/auth.controller');
const { validationMiddleware } = require('../middleware/validation.middleware');
const { loginSchema, registerSchema } = require('../schemas/auth.schemas');
const { authenticationMiddleware } = require('../middleware/authentication.middleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), login);
router.post('/register', validationMiddleware(registerSchema), register);
router.post('/logout', authenticationMiddleware, logout);

router.get('/verify-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.json({ valid: true, user });
    });
});

module.exports = router;
