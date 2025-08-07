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
const { authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (authenticated users)
router.get('/me', getMyProfile);
// Admin-only routes
router.get('/', authorizeAdmin, getAllUsers);
router.get('/stats', authorizeAdmin, getUserStats);
router.get('/:id', authorizeAdmin, getUserById);
router.patch('/:id', authorizeAdmin, updateUser);
router.delete('/:id', authorizeAdmin, deleteUser);
router.put('/me', editMyProfile);

module.exports = router;
