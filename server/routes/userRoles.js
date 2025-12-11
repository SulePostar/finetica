const express = require('express');
const {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
} = require('../controllers/userRoles');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();
router.get('/',
    // isAuthenticated
    getAllUserRoles);
router.get('/:id', isAuthenticated, getUserRoleById);
router.post('/',
    //isAuthenticated, 
    createUserRole);
router.delete('/:id', isAuthenticated, deleteUserRole);

module.exports = router;