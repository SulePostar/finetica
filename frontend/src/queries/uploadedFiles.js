import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFileToBucket } from "../api/uploadedFiles";
import { notify } from "@/utils/notify";

export const useBucketFileUpload = ({
    bucketName,
    invalidateKeys = [],
    successMessage = "File uploaded successfully",
    successDescription = "The file has been uploaded and processed.",
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, description }) =>
            uploadFileToBucket({ file, bucketName, description }),

        onSuccess: () => {
            invalidateKeys.forEach((key) => {
                queryClient.invalidateQueries({ queryKey: key });
            });

            notify.success(successMessage, {
                description: successDescription,
            });
        },

        onError: (err) => {
            notify.error("Upload failed", {
                description:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong during upload.",
            });
        },
    });
};
