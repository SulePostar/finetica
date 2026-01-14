import apiClient from "./axios";

const UPLOADED_FILES_BASE_PATH = "/files";

export const uploadFileToBucket = async ({ file, bucketName, description = "" }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketName", bucketName);
    if (description) {
        formData.append("description", description);
    }

    const { data } = await apiClient.post(
        `${UPLOADED_FILES_BASE_PATH}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

/**
 * Upload profile image for registration (no auth required)
 * @param {File} file - image file
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Object} { success: boolean, url?: string, error?: string }
 */
export const uploadProfileImage = async (file, firstName, lastName) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);

        const response = await apiClient.post('/files/upload-profile-image', formData, {
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
