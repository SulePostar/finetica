const express = require('express');
const {
  getAllUserStatuses,
  getUserStatusById,
  createUserStatus,
  deleteUserStatus,
} = require('../controllers/userStatus');
const { authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authorizeAdmin, getAllUserStatuses);
router.get('/:id', authorizeAdmin, getUserStatusById);
router.post('/', authorizeAdmin, createUserStatus);
router.delete('/:id', authorizeAdmin, deleteUserStatus);

module.exports = router;
