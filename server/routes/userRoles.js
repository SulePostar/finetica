const express = require('express');
const {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
} = require('../controllers/userRoles');
const isAuthenticated = require('../middleware/isAuthenticated');
const hasRole = require('../middleware/hasRole');

const router = express.Router();
router.get('/',
    isAuthenticated,
    hasRole(['admin']),
    getAllUserRoles);
router.get('/:id', isAuthenticated, getUserRoleById);
router.post('/',
    isAuthenticated,
    hasRole(['admin']),
    createUserRole);
router.delete('/:id',
    isAuthenticated,
    hasRole(['admin']),
    deleteUserRole);

module.exports = router;