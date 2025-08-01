// Export all services from a single entry point
export { default as api } from './api';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as roleService } from './roleService';
export { default as photoUploadService } from './photoUploadService';

// Export services as named exports for convenience
import authService from './authService';
import userService from './userService';
import roleService from './roleService';
import photoUploadService from './photoUploadService';
import api from './api';

export const services = {
  auth: authService,
  user: userService,
  role: roleService,
  photoUpload: photoUploadService,
  api,
};

export default services;
