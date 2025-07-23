import axios from 'axios';

const API_URL = 'http://localhost:5550/api/auth';

/**
 * Sends a registration request to the backend.
 * @param {object} userData - The user's registration data.
 * @param {string} userData.name - The user's full name or username.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.password - The user's password.
 * @returns {Promise<object>} The response data from the server.
 */
const register = async (userData) => {
  const { name, email, password } = userData;
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Sends a login request to the backend.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<object>} The response data from the server (containing the access token).
 */
const login = async (credentials) => {
  const { email, password } = credentials;
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  if (response.data) {
    localStorage.setItem('accessToken', response.data);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('accessToken');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
