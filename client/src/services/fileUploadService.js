import api from './api';

/**
 * Backend-based file upload service
 */
class FileUploadService {
  static ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  static MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  /**
   * Upload a file through the backend (admin only)
   * @param {File} file - The file to upload
   * @param {string} bucketName - Storage bucket name
   * @param {string} description - Optional file description
   * @returns {Promise<Object>} Upload result
   */
  static async uploadFile(file, bucketName, description = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', bucketName);
      if (description) {
        formData.append('description', description);
      }

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }

  /**
   * Upload a profile image (no authentication required)
   * @param {File} file - The image file to upload
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @returns {Promise<Object>} Upload result with backward compatibility
   */
  static async uploadProfileImage(file, firstName, lastName) {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);

      const response = await api.post('/files/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Return simplified result format
      if (response.data.success) {
        const result = {
          success: true,
          url: response.data.data.imageUrl,
          fileName: response.data.data.fileName,
        };

        return result;
      } else {
        return {
          success: false,
          error: response.data.message || 'Upload failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to upload profile image',
      };
    }
  }

  /**
   * Delete a file from storage (admin only)
   * @param {number} fileId - The ID of the file to delete
   * @returns {Promise<Object>} Delete result with backward compatibility
   */
  static async deleteFile(fileId) {
    try {
      const response = await api.delete(`/files/storage/${fileId}`);
      return {
        success: response.data.success,
        error: response.data.success ? null : response.data.message || 'Delete failed',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete file',
      };
    }
  }

  /**
   * Delete a profile image (alias for deleteFile for backward compatibility)
   * @param {number} fileId - The file ID to delete
   * @returns {Promise<Object>} Delete result
   */
  static async deleteProfileImage(fileId) {
    return this.deleteFile(fileId);
  }

  /**
   * Validate file before upload
   * @param {File} file - The file to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  static validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
    } = options;

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate image file specifically
   * @param {File} file - The image file to validate
   * @returns {Object} Validation result
   */
  static validateImageFile(file) {
    return this.validateFile(file, {
      allowedTypes: this.ALLOWED_IMAGE_TYPES,
      maxSize: this.MAX_IMAGE_SIZE,
    });
  }

  /**
   * Create a preview URL for a file
   * @param {File} file - The image file
   * @returns {Promise<string>} Data URL for preview
   */
  static createPreviewUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

export default FileUploadService;

// For backward compatibility - export as PhotoUploadService alias
export { FileUploadService as PhotoUploadService };
