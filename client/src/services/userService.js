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
  async getMyProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async updateMyProfile(userData) {
    try {
      const response = await api.patch('/users/me', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        profile_image: userData.profileImage
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async deleteMyAccount() {
    try {
      const response = await api.delete('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getUserByEmail(email) {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async updateUserByAdmin(id, userData) {
    try {
      const response = await api.patch(`/users/${id}`, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role_id: userData.roleId,
        is_email_verified: userData.isEmailVerified,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async deleteUserByAdmin(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async searchUsers(query, params = {}) {
    try {
      const response = await api.get('/users', { params });
      if (response.data.success && response.data.users) {
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
  async getUsersByRole(roleId, params = {}) {
    try {
      const response = await api.get('/users', { params });
      if (response.data.success && response.data.users) {
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
  async getUserStats() {
    try {
      const response = await api.get('/users');
      if (response.data.success && response.data.users) {
        const users = response.data.users;
        const stats = {
          total: users.length,
          approved: users.filter((user) => user.user_status?.status === 'approved').length,
          pending: users.filter((user) => user.user_status?.status === 'pending').length,
          rejected: users.filter((user) => user.user_status?.status === 'rejected').length,
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
  async getRecentlyActiveUsers(limit = 10) {
    try {
      const response = await api.get('/users');
      if (response.data.success && response.data.users) {
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
  handleError(error) {
    if (error.response) {
      const message =
        error.response.data?.message || error.response.data?.error || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}
export default new UserService();
