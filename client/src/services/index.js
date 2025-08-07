// Export all services from a single entry point
export { default as api } from './api';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as roleService } from './roleService';
export { default as fileUploadService } from './fileUploadService';

// Export services as named exports for convenience
import authService from './authService';
import userService from './userService';
import roleService from './roleService';
import fileUploadService from './fileUploadService';
import api from './api';

export const services = {
  auth: authService,
  user: userService,
  role: roleService,
  fileUpload: fileUploadService,
  api,
};

export default services;
