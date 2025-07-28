const express = require('express');
const {
  login,
  register,
  getProfile,
  refreshToken,
  logout,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require('../controllers/authentication');
const authorizeAdmin = require('../middleware/authMiddleware');

const router = express.Router();

const validate = require('../middleware/validation');
const registerUserSchema = require('../schemas/registerUser');
const loginUserSchema = require('../schemas/loginUser');

router.post('/login', validate(loginUserSchema), login);

router.post('/register', validate(registerUserSchema), register);

router.get('/profile', authorizeAdmin, getProfile);

router.post('/refresh', authorizeAdmin, refreshToken);

router.post('/logout', authorizeAdmin, logout);

router.get('/admin/pending-users', authorizeAdmin, getPendingUsers);

router.put('/admin/approve-user/:userId', authorizeAdmin, approveUser);

router.put('/admin/reject-user/:userId', authorizeAdmin, rejectUser);

module.exports = router;
