const express = require('express');
const {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  deleteUserRole,
} = require('../controllers/userRoles');
const { authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authorizeAdmin, getAllUserRoles);
router.get('/:id', authorizeAdmin, getUserRoleById);
router.post('/', authorizeAdmin, createUserRole);
router.delete('/:id', authorizeAdmin, deleteUserRole);

module.exports = router;
