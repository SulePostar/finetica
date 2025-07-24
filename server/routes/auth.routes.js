const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/profile', authMiddleware, authController.getProfile);

router.post('/refresh', authMiddleware, authController.refreshToken);

router.post('/logout', authController.logout);

router.get(
  '/admin/pending-users',
  authMiddleware,
  requireRole(['admin']),
  authController.getPendingUsers
);

router.put(
  '/admin/approve-user/:userId',
  authMiddleware,
  requireRole(['admin']),
  authController.approveUser
);

router.put(
  '/admin/reject-user/:userId',
  authMiddleware,
  requireRole(['admin']),
  authController.rejectUser
);

module.exports = router;
