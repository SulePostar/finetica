import api from './api';
import { store } from '../store/store';
import { login as loginAction, logout as logoutAction } from '../store/userSlice';

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const requestData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      };

      console.log('Sending registration data:', requestData);

      const response = await api.post('/auth/register', requestData);

      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Registration successful - don't auto-login, let user login manually
        return {
          success: true,
          message: response.data.message,
          user: response.data.data.user,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
          errors: response.data.errors,
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response data:', error.response?.data);

      // Handle different HTTP status codes
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data.message || 'Email already exists',
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || 'Invalid registration data',
          errors: error.response.data.errors,
        };
      }

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Registration failed',
          errors: error.response.data.errors,
        };
      }

      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success) {
        // Store token and user data
        // Store token separately (not persisted by Redux)
        localStorage.setItem('authToken', response.data.data.token);
        
        // Use Redux action to store user (this will be persisted automatically)
        store.dispatch(loginAction(response.data.data.user));

        return {
          success: true,
          message: response.data.message,
          user: response.data.data.user,
          token: response.data.data.token,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed',
          errors: response.data.errors,
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle different HTTP status codes
      if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response.data.message || 'Invalid credentials',
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || 'Invalid login data',
          errors: error.response.data.errors,
        };
      }

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Login failed',
          errors: error.response.data.errors,
        };
      }

      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  } // Logout user
  async logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API error:', error);
  } finally {
    // Use Redux action to clear user (this will update persistence automatically)
    store.dispatch(logoutAction());
    // Clear token separately
    localStorage.removeItem('authToken');
  }
}

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.patch('/auth/profile', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      });

      // Update stored user data if successful
      if (response.data.success && response.data.user) {
        const currentToken = this.getToken();
        this.setAuthData(currentToken, response.data.user);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.patch('/auth/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password with token
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/reset-password', {
        token: resetData.token,
        new_password: resetData.newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Resend email verification
  async resendEmailVerification() {
    try {
      const response = await api.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = store.getState().user.user; // Get from Redux instead
    return !!(token && user);
  }

  // Get stored auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Get stored user data
  getUser() {
    return store.getState().user.user;
  }

  // Set auth data in localStorage
  setAuthData(token, user) {
    localStorage.setItem('authToken', token);
    store.dispatch(loginAction(user));
  }

  // Clear auth data from localStorage
  clearAuthData() {
    localStorage.removeItem('authToken');
    store.dispatch(logoutAction()); 
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
export default new AuthService();
