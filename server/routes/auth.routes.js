const express = require('express');
const authService = require('../services/auth.service');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Register route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const result = await authService.refreshToken(req.user.id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Refresh token route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
});


router.get('/admin/pending-users', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const result = await authService.getPendingUsers();

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


router.put(
  '/admin/approve-user/:userId',
  authMiddleware,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const result = await authService.approveUser(req.params.userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Approve user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);


router.put(
  '/admin/reject-user/:userId',
  authMiddleware,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const result = await authService.rejectUser(req.params.userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Reject user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

module.exports = router;
