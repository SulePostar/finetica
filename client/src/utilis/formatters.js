import { CBadge } from '@coreui/react';
import { capitalizeFirst } from '../helpers/capitalizeFirstLetter';

/**
 * Gets the display name for a user's role.
 *
 * First checks if the user has a role object with a name property.
 * If not, falls back to mapping the roleId to a display name from dynamic roles.
 * Handles null/undefined users gracefully.
 *
 * @param {Object} user - The user object containing role information.
 * @param {Object} user.role - Optional role object with name property.
 * @param {string} user.role.name - The role name from the role object.
 * @param {number} user.role_id - The role ID (snake_case format).
 * @param {number} user.roleId - The role ID (camelCase format).
 * @param {Array} roles - Optional array of dynamic roles from API.
 * @returns {string} The formatted role name (e.g., "Admin", "Guest", "No Role Assigned").
 */
export const getRoleName = (user, roles = []) => {
  if (!user) return 'Unknown';

  if (user.role && user.role.name) {
    return capitalizeFirst(user.role.name);
  }

  const roleId = user.role_id || user.roleId;
  if (!roleId) return 'No Role';

  // Try to find role in dynamic roles first
  const dynamicRole = roles.find((r) => r.id === roleId);
  if (dynamicRole) {
    return capitalizeFirst(dynamicRole.role);
  }

  // Fallback to a generic message if no role found
  return 'No Role';
};

/**
 * Gets the display name for a status by its ID.
 *
 * Supports dynamic statuses from API.
 * Falls back to a generic message if dynamic statuses are not provided.
 *
 * @param {number} statusId - The status ID to look up.
 * @param {Array} statuses - Optional array of dynamic statuses from API.
 * @returns {string} The formatted status name (e.g., "Pending", "Approved", "Unknown").
 */
export const getStatusName = (statusId, statuses = []) => {
  if (!statusId) return 'Unknown';

  // Try to find status in dynamic statuses first
  const dynamicStatus = statuses.find((s) => s.id === statusId);
  if (dynamicStatus) {
    return capitalizeFirst(dynamicStatus.status);
  }

  // Fallback to a generic message if no status found
  return 'Unknown';
};

/**
 * Gets the display name for a role by its ID.
 *
 * Supports dynamic roles from API.
 * Falls back to a generic message if dynamic roles are not provided.
 *
 * @param {number} roleId - The role ID to look up.
 * @param {Array} roles - Optional array of dynamic roles from API.
 * @returns {string} The formatted role name (e.g., "Admin", "Guest", "No Role Assigned").
 */
export const getRoleNameById = (roleId, roles = []) => {
  if (!roleId) return 'No Role Assigned';

  // Try to find role in dynamic roles first
  const dynamicRole = roles.find((r) => r.id === roleId);
  if (dynamicRole) {
    return capitalizeFirst(dynamicRole.role);
  }

  // Fallback to a generic message if no role found
  return 'No Role Assigned';
};

/**
 * Creates a colored badge component for displaying user status.
 *
 * Uses CoreUI's CBadge component with appropriate colors based on status.
 * Supports dynamic statuses from API.
 *
 * @param {number} statusId - The status ID to create a badge for.
 * @param {Array} statuses - Optional array of dynamic statuses from API.
 * @returns {JSX.Element} A CBadge component with appropriate color and text.
 */
export const getStatusBadge = (statusId, statuses = []) => {
  const statusName = getStatusName(statusId, statuses);

  // Dynamic color mapping based on status name
  let color = 'info';
  if (statusName.toLowerCase().includes('approved')) {
    color = 'success';
  } else if (statusName.toLowerCase().includes('rejected') || statusName.toLowerCase().includes('deleted')) {
    color = 'danger';
  } else if (statusName.toLowerCase().includes('pending')) {
    color = 'warning';
  }

  return <CBadge color={color}>{statusName}</CBadge>;
};

/**
 * Gets the display name for a user.
 *
 * Prioritizes fullName, then falls back to email, then to a default message.
 * Handles null/undefined users gracefully.
 *
 * @param {Object} user - The user object.
 * @param {string} user.fullName - The user's full name.
 * @param {string} user.email - The user's email address.
 * @returns {string} The user's display name or fallback text.
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.fullName || user.email || 'Unknown User';
};

/**
 * Checks if a user is new (has no role assigned).
 *
 * A user is considered "new" if they don't have a roleId or role_id.
 * This is useful for displaying "New User" badges in the UI.
 *
 * @param {Object} user - The user object to check.
 * @param {number} user.roleId - The user's role ID (camelCase format).
 * @param {number} user.role_id - The user's role ID (snake_case format).
 * @returns {boolean} True if the user has no role assigned, false otherwise.
 */
export const isNewUser = (user) => {
  if (!user) return false;
  return !user.roleId && !user.role_id;
};

/**
 * Extracts a user-friendly error message from various error objects.
 *
 * Handles different error formats including Axios errors, standard Error objects,
 * and custom error responses. Provides a fallback message if no error details are found.
 *
 * @param {Error|Object} error - The error object to extract message from.
 * @param {Object} error.response - Axios response object (optional).
 * @param {Object} error.response.data - Response data containing error message (optional).
 * @param {string} error.response.data.message - Error message from API response (optional).
 * @param {string} error.message - Standard error message property (optional).
 * @returns {string} A user-friendly error message.
 */
export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Filters an array of users based on search term and role filter.
 *
 * Performs case-insensitive search on user display name and email.
 * Filters by role ID if a role filter is provided.
 * Excludes null/undefined users from results.
 *
 * @param {Array} users - Array of user objects to filter.
 * @param {string} searchTerm - The search term to filter by (case-insensitive).
 * @param {string|number} filterRole - Optional role ID to filter by.
 * @returns {Array} Filtered array of users matching the criteria.
 */
export const filterUsers = (users, searchTerm, filterRole) => {
  return users.filter((user) => {
    if (!user) return false;

    const searchText = getUserDisplayName(user).toLowerCase();
    const matchesSearch =
      searchText.includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle role filtering - support both roleId and role_id formats
    const matchesRole = !filterRole ||
      (user.role_id || user.roleId) === parseInt(filterRole);

    return matchesSearch && matchesRole;
  });
};

/**
 * Validates user form data for required fields and format.
 *
 * Checks email format and validity.
 * Returns an object with field names as keys and error messages as values.
 * Empty object indicates no validation errors.
 *
 * @param {Object} formData - The form data to validate.
 * @param {string} formData.email - The email address to validate.
 * @returns {Object} Object containing validation errors, empty if no errors.
 */
export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
};