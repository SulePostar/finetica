const express = require('express');
const { login } = require('../controllers/auth.controller');
const { validationMiddleware } = require('../middleware/validation.middleware');
const { loginSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), login);

module.exports = router;
