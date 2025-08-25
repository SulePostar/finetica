const express = require('express');
const {
  getAllUsers,
  getMyProfile,
  editMyProfile,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require('../controllers/user');
const isAuthenticated = require('../middleware/isAuthenticated');
const hasRole = require('../middleware/hasRole');
const router = express.Router();
// Public routes (authenticated users)
router.get('/me', getMyProfile);
// Admin-only routes
router.get('/', isAuthenticated, hasRole(['admin']), getAllUsers);
router.get('/stats', isAuthenticated, hasRole(['admin']), getUserStats);
router.get('/:id', isAuthenticated, hasRole(['admin']), getUserById);
router.put('/:id', isAuthenticated, hasRole(['admin']), updateUser);
router.delete('/:id', isAuthenticated, hasRole(['admin']), deleteUser);
router.put('/me', editMyProfile);
module.exports = router;