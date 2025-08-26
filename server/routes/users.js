const express = require('express');
const {
  getAllUsers,
  getMyProfile,
  editMyProfile,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user');
const isAuthenticated = require('../middleware/isAuthenticated');
const hasRole = require('../middleware/hasRole');
const router = express.Router();
// Public routes (authenticated users)
router.get('/me', getMyProfile);
router.put('/me', editMyProfile);
// Admin-only routes
router.get('/', isAuthenticated, hasRole(['admin']), getAllUsers);
router.get('/:id', isAuthenticated, hasRole(['admin']), getUserById);
router.put('/:id', isAuthenticated, hasRole(['admin']), updateUser);
router.delete('/:id', isAuthenticated, hasRole(['admin']), deleteUser);
module.exports = router;