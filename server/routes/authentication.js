const express = require('express');
const {
  login,
  register,
  getProfile,
  refreshToken,
  logout,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require('../controllers/authentication');
const authorizeAdmin = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/profile', authorizeAdmin, getProfile);

router.post('/refresh', authorizeAdmin, refreshToken);

router.post('/logout', authorizeAdmin, logout);

router.get('/admin/pending-users', authorizeAdmin, getPendingUsers);

router.put('/admin/approve-user/:userId', authorizeAdmin, approveUser);

router.put('/admin/reject-user/:userId', authorizeAdmin, rejectUser);

router.get('/verify-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.json({ valid: true, user });
    });
});

module.exports = router;
