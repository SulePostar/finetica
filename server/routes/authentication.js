const express = require('express');
const { login, register, refreshToken, logout } = require('../controllers/authentication');
const authorizeAdmin = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

const validate = require('../middleware/validation');
const registerUserSchema = require('../schemas/registerUser');
const loginUserSchema = require('../schemas/loginUser');

router.post('/login', validate(loginUserSchema), login);

router.post('/register', validate(registerUserSchema), register);

router.post('/refresh', refreshToken);

router.post('/logout', logout);

module.exports = router;
