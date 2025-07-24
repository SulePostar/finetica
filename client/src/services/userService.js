import api from './api';

class UserService {
  // Get all users
  async getAllUsers(params = {}) {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user profile (me)
  async getMyProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update current user profile (me)
  async updateMyProfile(userData) {
    try {
      const response = await api.patch('/users/me', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete current user account (me)
  async deleteMyAccount() {
    try {
      const response = await api.delete('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user by admin
  async updateUserByAdmin(id, userData) {
    try {
      const response = await api.patch(`/users/${id}`, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role_id: userData.roleId,
        is_active: userData.isActive,
        is_email_verified: userData.isEmailVerified,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user by admin
  async deleteUserByAdmin(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search users by name or email (client-side filtering)
  async searchUsers(query, params = {}) {
    try {
      const response = await api.get('/users', { params });

      if (response.data.success && response.data.users) {
        // Filter users based on query
        const filteredUsers = response.data.users.filter(
          (user) =>
            user.first_name?.toLowerCase().includes(query.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
        );

        return {
          ...response.data,
          users: filteredUsers,
          total: filteredUsers.length,
        };
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get users by role (client-side filtering)
  async getUsersByRole(roleId, params = {}) {
    try {
      const response = await api.get('/users', { params });

      if (response.data.success && response.data.users) {
        // Filter users by role
        const filteredUsers = response.data.users.filter((user) => user.role_id === roleId);

        return {
          ...response.data,
          users: filteredUsers,
          total: filteredUsers.length,
        };
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Toggle user active status
  async toggleUserStatus(id, isActive) {
    try {
      const response = await api.patch(`/users/${id}`, {
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user role
  async updateUserRole(id, roleId) {
    try {
      const response = await api.patch(`/users/${id}`, {
        role_id: roleId,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify user email (admin action)
  async verifyUserEmail(id) {
    try {
      const response = await api.patch(`/users/${id}`, {
        is_email_verified: true,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user statistics (client-side calculation)
  async getUserStats() {
    try {
      const response = await api.get('/users');

      if (response.data.success && response.data.users) {
        const users = response.data.users;
        const stats = {
          total: users.length,
          active: users.filter((user) => user.is_active).length,
          inactive: users.filter((user) => !user.is_active).length,
          verified: users.filter((user) => user.is_email_verified).length,
          unverified: users.filter((user) => !user.is_email_verified).length,
          byRole: users.reduce((acc, user) => {
            acc[user.role_id] = (acc[user.role_id] || 0) + 1;
            return acc;
          }, {}),
        };

        return {
          success: true,
          stats,
        };
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get recently active users (client-side sorting)
  async getRecentlyActiveUsers(limit = 10) {
    try {
      const response = await api.get('/users');

      if (response.data.success && response.data.users) {
        // Sort by last_login_at or updated_at
        const sortedUsers = response.data.users
          .filter((user) => user.last_login_at || user.updated_at)
          .sort((a, b) => {
            const dateA = new Date(a.last_login_at || a.updated_at);
            const dateB = new Date(b.last_login_at || b.updated_at);
            return dateB - dateA;
          })
          .slice(0, limit);

        return {
          ...response.data,
          users: sortedUsers,
          total: sortedUsers.length,
        };
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message || error.response.data?.error || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export default new UserService();
