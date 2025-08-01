import { supabase } from '../lib/supabase';

/**
 * Photo upload service for handling profile images
 */
class PhotoUploadService {
  static BUCKET_NAME = 'user-images';
  static MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  static ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * Validates if the file is a valid image
   * @param {File} file - The file to validate
   * @returns {Object} - { isValid: boolean, error: string }
   */
  static validateImageFile(file) {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please select JPG, PNG, GIF, or WebP images.',
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB',
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * Generates a unique filename for the profile image
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {string} fileExtension - Original file extension
   * @returns {string} - Generated filename
   */
  static generateFileName(firstName, lastName, fileExtension) {
    const timestamp = Date.now();
    const username = `${firstName}_${lastName}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `profile_${username}_${timestamp}.${fileExtension}`;
  }

  /**
   * Uploads profile image to Supabase storage
   * @param {File} file - The image file to upload
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @returns {Promise<Object>} - { success: boolean, url?: string, error?: string }
   */
  static async uploadProfileImage(file, firstName, lastName) {
    try {
      // Validate file
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Generate filename
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileName = this.generateFileName(firstName, lastName, fileExtension);

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path,
        fileName: fileName,
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload photo',
      };
    }
  }

  /**
   * Deletes a profile image from Supabase storage
   * @param {string} filePath - The file path to delete
   * @returns {Promise<Object>} - { success: boolean, error?: string }
   */
  static async deleteProfileImage(filePath) {
    try {
      const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Photo delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete photo',
      };
    }
  }

  /**
   * Creates a preview URL for a file
   * @param {File} file - The image file
   * @returns {Promise<string>} - Data URL for preview
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

export default PhotoUploadService;
