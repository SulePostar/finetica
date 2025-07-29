const express = require('express');
const { login, register, refreshToken, logout } = require('../controllers/authentication');
const authorizeAdmin = require('../middleware/authMiddleware');

const router = express.Router();

const validate = require('../middleware/validation');
const registerUserSchema = require('../schemas/registerUser');
const loginUserSchema = require('../schemas/loginUser');

router.post('/login', validate(loginUserSchema), login);

router.post('/register', validate(registerUserSchema), register);

router.post('/refresh', refreshToken);

router.post('/logout', logout);

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
