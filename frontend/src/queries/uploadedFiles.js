import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadBankTransactionsFile } from "../api/uploadedFiles";
import { bankTransactionKeys } from "./BankTransactionsQueries";
import { notify } from "../lib/notifications";

export const useUploadBankTransactionsFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, description }) =>
            uploadBankTransactionsFile(file, description),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bankTransactionKeys.lists(),
            });

            notify.success("Upload successful", {
                description: "Transactions imported successfully",
            });
        },

        onError: (err) => {
            notify.error("Upload failed", {
                description:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong.",
            });
        },
    });
};

