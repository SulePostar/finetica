const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
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
  extractFileParts(fileBuffer, fileName, mimeType) {
    if (fileBuffer && fileBuffer.buffer && fileBuffer.originalname) {
      return {
        buffer: fileBuffer.buffer,
        originalName: fileName || fileBuffer.originalname,
        mimeType: mimeType || fileBuffer.mimetype,
      };
    }
    return {
      buffer: fileBuffer,
      originalName: fileName,
      mimeType,
    };
  }
  /**
   * Upload a file to Supabase storage
   * @param {Buffer|Object} fileBuffer - File buffer or multer file object
   * @param {string} fileName - Name for the file (optional if fileBuffer is multer file object)
   * @param {string} bucketName - Storage bucket name
   * @param {string} mimeType - File MIME type (optional if fileBuffer is multer file object)
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(fileBuffer, fileName, bucketName, mimeType, upsert = false) {
    try {
      const { buffer, originalName, mimeType: type } = this.extractFileParts(
        fileBuffer,
        fileName,
        mimeType
      );
      let finalName = fileName || originalName;
      finalName = this.sanitizeFileName(finalName);
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(finalName, buffer, {
          contentType: type,
          cacheControl: '3600',
          upsert,
        });
      if (error) {
        if (error.message && error.message.includes('already exists')) {
          return {
            success: false,
            code: 'DUPLICATE',
            error: 'File already exists in bucket.'
          };
        }
        throw new Error(`Storage upload failed: ${error.message}`);
      }
      const { data: urlData } = this.supabase.storage.from(bucketName).getPublicUrl(data.path);
      return {
        success: true,
        path: data.path,
        publicUrl: `${urlData.publicUrl}?v=${Date.now()}`,
        fileName: finalName,
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
      const sanitizedFirstName = this.sanitizeFileName(firstName).toLowerCase();
      const sanitizedLastName = this.sanitizeFileName(lastName).toLowerCase();
      const username = `${sanitizedFirstName}_${sanitizedLastName}`;
      let ext;
      if (fileBuffer && fileBuffer.originalname) {
        ext = fileBuffer.originalname.split('.').pop();
      } else {
        ext = fileExtension;
      }
      const finalName = `${username}.${ext}`;
      return await this.uploadFile(fileBuffer, finalName, 'user-images', mimeType, true);
    } catch (error) {
      console.error('Profile image upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  /**
   * Uploads all valid files from a local folder to a Supabase storage bucket.
   *
   * @param {string} folderPath - Path to the local folder containing files to upload.
   * @param {string} bucketName - Name of the Supabase storage bucket where files will be uploaded.
   * @param {Object} [options={}] - Optional validation options passed to the file validation method.
   */
  async uploadFolder(folderPath, bucketName, options = {}) {
    const files = fs.readdirSync(folderPath);
    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';
      const fileSize = fileBuffer.length;
      // Validate file before upload
      const validation = this.validateFile(mimeType, fileSize, options);
      if (!validation.isValid) {
        console.log(`Skipping ${fileName}: ${validation.error}`);
        continue;
      }
      const result = await this.uploadFile(fileBuffer, fileName, bucketName, mimeType);
      if (result.success) {
        console.log(`Successfully uploaded: ${fileName}`);
      } else {
        if (result.error.includes('The resource already exists')) {
          console.log(`File already exists: ${fileName}, skipping.`);
        } else {
          console.error(`Error during upload ${fileName}:`, result.error);
        }
      }
    }
  }
  async getFile(bucketName, filePath) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .download(filePath);
      if (error) {
        throw new Error(`File download failed: ${error.message}`);
      }
      const buffer = await data.arrayBuffer();
      return {
        buffer,
        mimeType: data.type,
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteFile(filePath, bucketName) {
    const { error } = await this.supabase.storage.from(bucketName).remove([filePath]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return { success: true };
  }

  async getSignedUrl(bucketName, filePath, expiresIn = 120) {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }
    return data.signedUrl;
  }
}
module.exports = new SupabaseService();