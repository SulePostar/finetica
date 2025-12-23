import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DefaultLayout from "@/layout/DefaultLayout";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

import { useBankTransactions, bankTransactionKeys } from "@/queries/BankTransactionsQueries";
import { useQueryToast } from "@/hooks/use-query-toast";
import { getBankTransactionsColumns } from "@/components/tables/columns/BankTransactionsColumns";

import { uploadFileToBucket } from "@/api/uploadedFiles";
import { notify } from "@/lib/notifications";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
const BankTransactions = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [timeRange, setTimeRange] = useState("all");
    const handleAction = useAction('bank-statements');
    const { data, isPending, isError, error, refetch } = useBankTransactions({
        page,
        perPage,
    });

    const queryClient = useQueryClient();

    const {
        mutateAsync: uploadFile,
        isPending: isUploading,
    } = useMutation({
        mutationFn: ({ file, description }) =>
            uploadFileToBucket({
                file,
                bucketName: "transactions",
                description,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bankTransactionKeys.all });

            notify.success("Bank transactions uploaded", {
                description: "Bank transaction file has been processed successfully.",
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

    const handleFileUpload = async (file) => {
        await uploadFile({ file, description: "Bank transactions PDF" });
    };

    useQueryToast({
        isPending,
        isError,
        data,
        error,
        successMessage: "Bank transactions loaded",
        successDescription: "All transactions have been fetched successfully.",
        errorMessage: "Failed to load bank transactions",
    });
    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };
    if (isPending) {
        return (
            <>
                <PageTitle text="Bank Transactions" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <div>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Bank Transactions"
                    showDetails={true}
                />
            </div>
        );
    }

    const rows = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable
                    header={
                        <div className="flex items-center justify-between gap-4">
                            <PageTitle
                                text="Bank Transactions"
                                subtitle="Overview of all bank transactions"
                                compact
                            />
                            <div className="flex items-center gap-4">

                                <div className="flex items-center gap-3">
                                    {isUploading && (
                                        <span className="text-sm text-muted-foreground">
                                            Uploading & processing...
                                        </span>
                                    )}

                                    <UploadButton
                                        onUploadSuccess={handleFileUpload}
                                        buttonText="Upload Bank Transactions"
                                        className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                                    />
                                    <TimeFilter
                                        value={timeRange}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    columns={getBankTransactionsColumns(handleAction)}
                    data={rows}
                    total={total}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                />
            </div>
        </DefaultLayout>
    );
};

export default BankTransactions;
