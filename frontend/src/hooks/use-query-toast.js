import { useEffect, useRef } from "react";
import { notify } from "@/lib/notifications";

export function useQueryToast({
    isPending,
    isError,
    data,
    error,
    successMessage = "Data loaded successfully",
    successDescription,
    errorMessage = "Failed to load data",
    errorDescription,
}) {
    const prevStatusRef = useRef({
        isPending: true,
        isError: false,
    });

    useEffect(() => {
        const prevStatus = prevStatusRef.current;

        if (
            prevStatus.isPending &&
            !isPending &&
            !isError &&
            data
        ) {
            notify.success(successMessage, {
                description:
                    successDescription || undefined,
            });
        }

        if (!prevStatus.isError && isError) {
            notify.error(errorMessage, {
                description:
                    errorDescription ||
                    error?.message ||
                    undefined,
            });
        }

        prevStatusRef.current = { isPending, isError };
    }, [isPending, isError, data, error, successMessage, successDescription, errorMessage, errorDescription]);
}
