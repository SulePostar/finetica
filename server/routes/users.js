const express = require('express');
const { getAllUsers, getMyProfile } = require('../controllers/user');

const router = express.Router();

router.get('/me', getMyProfile);

router.get('/', getAllUsers);

module.exports = router;
