import apiClient from "./axios";

const UPLOADED_FILES_BASE_PATH = "/uploaded-files";

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
