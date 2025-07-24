const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authMiddleware');

router.get('/admin', authorizeRole, (req, res) => {
    res.json({ message: `Dobrodošao, admin ${req.user.id}!` });
});

module.exports = router;
