import api from './api';
import { store } from '../store';
import { loginSuccess, logout as logoutAction, setLoading } from '../redux/auth/authSlice';
import { setUserProfile } from '../redux/user/userSlice';
class AuthService {
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
  async login(credentials) {
    try {
      console.log('Attempting login with credentials:', {
        email: credentials.email,
        password: '[REDACTED]',
      });
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      if (response.data.success) {
        localStorage.setItem('jwt_token', response.data.data.token);
        if (store && response.data.data.token) {
          try {
            store.dispatch(loginSuccess({ token: response.data.data.token }));
            store.dispatch(setUserProfile(response.data.data.user));
            // console.log('Login successful, user data:', response.data.data.user);
          } catch (dispatchError) {
            console.error('Error dispatching login action:', dispatchError);
            console.warn('Redux dispatch failed, continuing with token-only auth');
          }
        }
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
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response.data.message || 'Invalid credentials',
        };
      }
      if (error.response?.status === 400) {
        console.error('400 Bad Request details:', {
          message: error.response.data.message,
          errors: error.response.data.errors,
          validationErrors: error.response.data.validation_errors,
        });
        return {
          success: false,
          message: error.response.data.message || 'Invalid login data',
          errors: error.response.data.errors || error.response.data.validation_errors,
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
  }
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      if (store) {
        try {
          store.dispatch(logoutAction());
        } catch (error) {
          console.error('Error dispatching logout action:', error);
        }
      }
    }
  }
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async updateProfile(userData) {
    try {
      const response = await api.patch('/auth/profile', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      });
      if (response.data.success && response.data.user) {
        const currentToken = this.getToken();
        this.setAuthData(currentToken, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
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
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
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
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async resendEmailVerification() {
    try {
      const response = await api.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    let isAuthenticated = false;
    try {
      if (store && store.getState() && store.getState().auth) {
        isAuthenticated = store.getState().auth.isAuthenticated;
      }
    } catch (error) {
      console.warn('Error accessing Redux store state:', error);
      return !!token;
    }
    return isAuthenticated || !!token;
  }
  getToken() {
    return localStorage.getItem('jwt_token');
  }
  getUser() {
    try {
      if (store && store.getState() && store.getState().auth) {
        return store.getState().auth.user;
      }
    } catch (error) {
      console.warn('Error accessing user from Redux store:', error);
    }
    return null;
  }
  setAuthData(token, user) {
    localStorage.setItem('jwt_token', token);
    if (store && token) {
      try {
        store.dispatch(loginSuccess({ token }));
      } catch (error) {
        console.error('Error dispatching login action in setAuthData:', error);
      }
    }
  }
  clearAuthData() {
    localStorage.removeItem('jwt_token');
    if (store) {
      try {
        store.dispatch(logoutAction());
      } catch (error) {
        console.error('Error dispatching logout action:', error);
      }
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
export default new AuthService();
