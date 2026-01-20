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
 * @returns {Object} { success: boolean, url?: string, error?: string }
 */
export const uploadProfileImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await apiClient.post(`${UPLOADED_FILES_BASE_PATH}/upload-profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data?.success) {
            return { success: true, url: response.data.data.imageUrl, fileName: response.data.data.fileName };
        }

        return { success: false, error: response.data?.message || 'Upload failed' };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message || 'Upload failed' };
    }
};
