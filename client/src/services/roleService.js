import api from './api';

class RoleService {
  // Get all roles
  async getRoles() {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      // If roles endpoint doesn't exist yet, return default roles
      if (error.response?.status === 404) {
        return {
          success: true,
          roles: [
            { id: 1, name: 'guest', description: 'Guest user with limited access' },
            { id: 2, name: 'user', description: 'Regular user with standard access' },
            { id: 3, name: 'admin', description: 'Administrator with full access' },
          ],
        };
      }
      throw this.handleError(error);
    }
  }

  // Get role by ID
  async getRoleById(id) {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      // If roles endpoint doesn't exist yet, return default role
      if (error.response?.status === 404) {
        const defaultRoles = [
          { id: 1, name: 'guest', description: 'Guest user with limited access' },
          { id: 2, name: 'user', description: 'Regular user with standard access' },
          { id: 3, name: 'admin', description: 'Administrator with full access' },
        ];
        const role = defaultRoles.find((r) => r.id === parseInt(id));
        return {
          success: true,
          role: role || null,
        };
      }
      throw this.handleError(error);
    }
  }

  // Create new role (for when backend supports it)
  async createRole(roleData) {
    try {
      const response = await api.post('/roles', {
        name: roleData.name,
        description: roleData.description,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update role (for when backend supports it)
  async updateRole(id, roleData) {
    try {
      const response = await api.put(`/roles/${id}`, {
        name: roleData.name,
        description: roleData.description,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete role (for when backend supports it)
  async deleteRole(id) {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get users by role (uses user service)
  async getUsersByRole(roleId) {
    try {
      // This will use the user service filtering since roles endpoint might not exist
      const userService = require('./userService').default;
      return await userService.getUsersByRole(roleId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get role name by ID (helper function)
  getRoleName(roleId) {
    const roleNames = {
      1: 'guest',
      2: 'user',
      3: 'admin',
    };
    return roleNames[roleId] || 'unknown';
  }

  // Check if role has permission (helper function)
  hasPermission(roleId, permission) {
    const permissions = {
      1: ['read'], // guest
      2: ['read', 'write'], // user
      3: ['read', 'write', 'admin'], // admin
    };
    return permissions[roleId]?.includes(permission) || false;
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
export default new RoleService();
