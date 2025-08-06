const express = require('express');
const { getAllUsers, getMyProfile, editMyProfile } = require('../controllers/user');

const router = express.Router();

router.get('/me', getMyProfile);
router.get('/', getAllUsers);
router.put('/me', editMyProfile);

module.exports = router;
