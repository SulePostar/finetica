const express = require('express');
const router = express.Router();
const authorizeAdmin = require('../middleware/authMiddleware');

router.get('/admin', authorizeAdmin, (req, res) => {
    res.json({ message: `Welcome, admin` });
});

module.exports = router;
