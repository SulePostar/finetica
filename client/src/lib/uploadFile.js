import { supabase } from './supabase';

/**
 * Upload file to Supabase storage and save record to database
 * @param {File} file - The file to upload
 * @param {string} bucketName - Storage bucket name (default: 'files')
 * @param {string} description - Optional file description
 * @returns {Promise<Object>} File upload result with database record
 */
export async function uploadFile(file, bucketName = 'files', description = '') {
  try {
    // Generate unique file name to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${file.name}`;
    const filePath = fileName;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    // Prepare file data for database
    const fileData = {
      file_name: fileName,
      file_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
      bucket_name: bucketName,
      description: description,
    };

    // Save file record to database
    const dbResponse = await saveFileToDatabase(fileData);

    return {
      success: true,
      storage: {
        path: data.path,
        fullPath: data.fullPath,
      },
      database: dbResponse,
      fileUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Save file record to database via API
 * @param {Object} fileData - File data to save
 * @returns {Promise<Object>} Database response
 */
async function saveFileToDatabase(fileData) {
  try {
    const token = localStorage.getItem('jwt_token'); // Fixed: use correct token key
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fileData),
    });

    if (!response.ok) {
      throw new Error(`Database save failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Database save error:', error);
    // Don't throw here - file is already uploaded to storage
    // You might want to implement a retry mechanism or manual sync
    return { error: error.message };
  }
}

/**
 * Get uploaded files from database
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Files data
 */
export async function getUploadedFiles(options = {}) {
  try {
    const token = localStorage.getItem('jwt_token');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(options).toString();

    const response = await fetch(`${apiBaseUrl}/files${queryParams ? `?${queryParams}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Fetch files error:', error);
    throw error;
  }
}

/**
 * Get current user's uploaded files
 * @param {Object} options - Query options
 * @returns {Promise<Array>} User's files
 */
export async function getMyUploadedFiles(options = {}) {
  try {
    const token = localStorage.getItem('jwt_token');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(options).toString();

    const response = await fetch(
      `${apiBaseUrl}/files/my-files${queryParams ? `?${queryParams}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user files: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Fetch user files error:', error);
    throw error;
  }
}

/**
 * Delete file record from database (soft delete)
 * @param {number} fileId - File ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFileRecord(fileId) {
  try {
    const token = localStorage.getItem('jwt_token');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}

/**
 * Update file record in database
 * @param {number} fileId - File ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated file record
 */
export async function updateFileRecord(fileId, updateData) {
  try {
    const token = localStorage.getItem('jwt_token');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update file: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Update file error:', error);
    throw error;
  }
}
