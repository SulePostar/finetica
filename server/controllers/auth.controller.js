const authService = require('../services/auth.service');

class AuthController {
 
  async login(req, res) {
    try {
      const result = await authService.login(req.body);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  }

 
  async register(req, res) {
    try {
      const result = await authService.register(req.body);

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Register controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  }

 
  async getProfile(req, res) {
    try {
      const result = await authService.getProfile(req.user.id);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error('Get profile controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching profile',
      });
    }
  }

 
  async refreshToken(req, res) {
    try {
      const result = await authService.refreshToken(req.user.id);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Refresh token controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while refreshing token',
      });
    }
  }

 
  async logout(req, res) {
    try {
     
      return res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove the token from client storage.',
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during logout',
      });
    }
  }

 
  async getPendingUsers(req, res) {
    try {
      const result = await authService.getPendingUsers();

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Get pending users controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching pending users',
      });
    }
  }

 
  async approveUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const result = await authService.approveUser(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Approve user controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while approving user',
      });
    }
  }

 
  async rejectUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const result = await authService.rejectUser(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Reject user controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while rejecting user',
      });
    }
  }
}

module.exports = new AuthController();
