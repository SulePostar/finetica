const express = require('express');
const { getAllUsers, getMyProfile, editMyProfile } = require('../controllers/user');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.get('/me', isAuthenticated, getMyProfile);
router.get('/', getAllUsers);
router.put('/me', editMyProfile);

module.exports = router;
