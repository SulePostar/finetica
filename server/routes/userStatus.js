const express = require('express');
const {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
} = require('../controllers/userStatus');

const isAuthenticated = require('../middleware/isAuthenticated');
const hasRole = require('../middleware/hasRole');

const router = express.Router();
router.get('/',
    isAuthenticated,
    hasRole(['admin']),
    getAllUserStatuses);
router.get('/:id', isAuthenticated, getUserStatusById);
router.post('/',
    isAuthenticated,
    hasRole(['admin']),
    createUserStatus);
router.delete('/:id', isAuthenticated, hasRole(['admin']), deleteUserStatus);

module.exports = router;
