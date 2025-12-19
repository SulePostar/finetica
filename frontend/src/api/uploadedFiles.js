import apiClient from "./axios";

const UPLOADED_FILES_BASE_PATH = "/files";

export const uploadBankTransactionsFile = async (file, description = "") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketName", "transactions");
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
