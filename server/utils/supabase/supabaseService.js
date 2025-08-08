const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Sanitize filename to remove special characters that aren't supported by Supabase
   * Converts Bosnian/Croatian/Serbian characters to Latin equivalents
   * @param {string} filename - Original filename
   * @returns {string} Sanitized filename
   */
  sanitizeFileName(filename) {
    if (!filename || typeof filename !== 'string') {
      return 'file';
    }

    const sanitized = filename
      // Replace special characters with their Latin equivalents
      .replace(/[ćĆ]/g, 'c')
      .replace(/[čČ]/g, 'c')
      .replace(/[đĐ]/g, 'd')
      .replace(/[šŠ]/g, 's')
      .replace(/[žŽ]/g, 'z')
      .replace(/[áÁ]/g, 'a')
      .replace(/[éÉ]/g, 'e')
      .replace(/[íÍ]/g, 'i')
      .replace(/[óÓôÔ]/g, 'o')
      .replace(/[úÚ]/g, 'u')
      .replace(/[ýÝ]/g, 'y')
      .replace(/[ňŇ]/g, 'n')
      .replace(/[ťŤ]/g, 't')
      .replace(/[ľĽ]/g, 'l')
      .replace(/[ŕŔ]/g, 'r')
      .replace(/[äÄ]/g, 'a')
      .replace(/[öÖ]/g, 'o')
      .replace(/[üÜ]/g, 'u')
      .replace(/ß/g, 'ss')
      // Replace any remaining non-ASCII characters with underscore
      .replace(/[^\x00-\x7F]/g, '');

    return sanitized || 'file';
  }

  /**
   * Upload a file to Supabase storage
   * @param {Buffer|Object} fileBuffer - File buffer or multer file object
   * @param {string} fileName - Name for the file (optional if fileBuffer is multer file object)
   * @param {string} bucketName - Storage bucket name
   * @param {string} mimeType - File MIME type (optional if fileBuffer is multer file object)
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(fileBuffer, fileName, bucketName, mimeType) {
    try {
      // Handle both direct buffer and multer file object
      let buffer, name, type;

      if (fileBuffer && fileBuffer.buffer && fileBuffer.originalname) {
        // It's a multer file object
        buffer = fileBuffer.buffer;
        name = fileName || fileBuffer.originalname;
        type = mimeType || fileBuffer.mimetype;
      } else {
        // It's a direct buffer
        buffer = fileBuffer;
        name = fileName;
        type = mimeType;
      }

      // Sanitize filename to remove special characters
      const sanitizedName = this.sanitizeFileName(name);
      const uniqueFileName = `${sanitizedName}`;

      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, buffer, {
          contentType: type,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage.from(bucketName).getPublicUrl(data.path);

      return {
        success: true,
        path: data.path,
        publicUrl: urlData.publicUrl,
        fileName: uniqueFileName,
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload profile image to Supabase storage
   * @param {Buffer|Object} fileBuffer - Image file buffer or multer file object
   * @param {string} firstName - User's first name (optional if fileBuffer is multer file object)
   * @param {string} lastName - User's last name (optional if fileBuffer is multer file object)
   * @param {string} fileExtension - File extension (optional if fileBuffer is multer file object)
   * @param {string} mimeType - File MIME type (optional if fileBuffer is multer file object)
   * @returns {Promise<Object>} Upload result
   */
  async uploadProfileImage(fileBuffer, firstName, lastName, fileExtension, mimeType) {
    try {
      let fileName;

      if (fileBuffer && fileBuffer.buffer && fileBuffer.originalname) {
        // It's a multer file object - construct filename from firstName and lastName
        const ext = fileBuffer.originalname.split('.').pop();
        const sanitizedFirstName = this.sanitizeFileName(firstName);
        const sanitizedLastName = this.sanitizeFileName(lastName);
        const username = `${sanitizedFirstName}_${sanitizedLastName}`.toLowerCase();
        fileName = `${username}.${ext}`;

        const result = await this.uploadFile(fileBuffer, fileName, 'user-images');

        // Make sure we return the result in the expected format
        if (result.success) {
          return result;
        } else {
          return {
            success: false,
            error: result.error || 'Upload failed',
          };
        }
      } else {
        // Legacy mode - construct filename from parameters
        const sanitizedFirstName = this.sanitizeFileName(firstName);
        const sanitizedLastName = this.sanitizeFileName(lastName);
        const username = `${sanitizedFirstName}_${sanitizedLastName}`.toLowerCase();
        fileName = `${username}.${fileExtension}`;
        return await this.uploadFile(fileBuffer, fileName, 'user-images', mimeType);
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete a file from Supabase storage
   * @param {string} filePath - Path to the file in storage
   * @param {string} bucketName - Storage bucket name
   * @returns {Promise<Object>} Delete result
   */
  async deleteFile(filePath, bucketName) {
    try {
      const { error } = await this.supabase.storage.from(bucketName).remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Supabase delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate file type and size
   * @param {string} mimeType - File MIME type
   * @param {number} fileSize - File size in bytes
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(mimeType, fileSize, options = {}) {
    const {
      allowedTypes = [],
      maxSize = 10 * 1024 * 1024, // 10MB default
      minSize = 0,
    } = options;

    if (allowedTypes.length > 0 && !allowedTypes.includes(mimeType)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (fileSize > maxSize) {
      return {
        isValid: false,
        error: `File size too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`,
      };
    }

    if (fileSize < minSize) {
      return {
        isValid: false,
        error: `File size too small. Minimum size: ${minSize} bytes`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate image file specifically
   * @param {string|Object} mimeType - File MIME type or multer file object
   * @param {number} fileSize - File size in bytes (optional if mimeType is multer file object)
   * @returns {Object} Validation result
   */
  validateImageFile(mimeType, fileSize) {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    // Handle both direct parameters and multer file object
    let type, size;
    if (mimeType && mimeType.mimetype && mimeType.size) {
      // It's a multer file object
      type = mimeType.mimetype;
      size = mimeType.size;
    } else {
      // Direct parameters
      type = mimeType;
      size = fileSize;
    }

    return this.validateFile(type, size, {
      allowedTypes: allowedImageTypes,
      maxSize: 5 * 1024 * 1024, // 5MB for images
    });
  }

  /**
   * List all storage buckets
   * @returns {Promise<Array>} List of buckets
   */
  async listBuckets() {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();

      if (error) {
        throw new Error(`Failed to list buckets: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('List buckets error:', error);
      throw error;
    }
  }

  /**
   * Create a storage bucket if it doesn't exist
   * @param {string} bucketName - Name of the bucket to create
   * @param {Object} options - Bucket options
   * @returns {Promise<Object>} Creation result
   */
  async createBucket(bucketName, options = {}) {
    try {
      const { data, error } = await this.supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: null, // Allow all types
        ...options,
      });

      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create bucket error:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseService();
