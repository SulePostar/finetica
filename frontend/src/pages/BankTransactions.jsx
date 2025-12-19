import { useState } from "react";
import DefaultLayout from "@/layout/DefaultLayout";

import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

import { useBankTransactions } from "@/queries/BankTransactionsQueries";
import { useUploadBankTransactionsFile } from "@/queries/uploadedFiles";
import { useQueryToast } from "@/hooks/use-query-toast";
import { getBankTransactionsColumns } from "@/components/tables/columns/BankTransactionsColumns";

const BankTransactions = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;

    const { data, isPending, isError, error, refetch } = useBankTransactions({
        page,
        perPage,
    });

    const {
        mutateAsync: uploadFile,
        isPending: isUploading,
    } = useUploadBankTransactionsFile();

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

                            <div className="flex items-center gap-3">
                                {isUploading && (
                                    <span className="text-sm text-muted-foreground">
                                        Uploading & processing...
                                    </span>
                                )}

                                <UploadButton
                                    onUploadSuccess={handleFileUpload}
                                    className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                                />
                            </div>
                        </div>
                    }
                    columns={getBankTransactionsColumns()}
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
