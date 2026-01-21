const express = require('express');
const { login, register, refreshToken, logout, requestPasswordReset, resetPassword } = require('../controllers/authentication');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const validate = require('../middleware/validation');
const registerUserSchema = require('../schemas/registerUser');
const loginUserSchema = require('../schemas/loginUser');

router.post('/login', validate(loginUserSchema), login);

router.post('/register', validate(registerUserSchema), register);

router.post('/refresh', refreshToken);

router.post('/logout', verifyToken, logout);

// Password reset routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
