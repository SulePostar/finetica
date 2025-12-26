const express = require('express');
const {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
} = require('../controllers/userStatus');

const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();
router.get('/',
    // isAuthenticated
    getAllUserStatuses);
router.get('/:id', isAuthenticated, getUserStatusById);
router.post('/',
    // isAuthenticated,
    createUserStatus);
router.delete('/:id',
    //isAuthenticated, 
    deleteUserStatus);

module.exports = router;
