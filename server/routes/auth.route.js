const express = require('express');
const { login, register, logout } = require('../controllers/auth.controller');
const { validationMiddleware } = require('../middleware/validation.middleware');
const { loginSchema, registerSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), login);
router.post('/register', validationMiddleware(registerSchema), register);
router.post('/logout', logout);

module.exports = router;
