import { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

import {
    useBankTransactions,
    bankTransactionKeys,
} from "@/queries/BankTransactionsQueries";
import { getBankTransactionsColumns } from "@/components/tables/columns/BankTransactionsColumns";

import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";

const BankTransactions = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [timeRange, setTimeRange] = useState("all");
    const handleAction = useAction("bank-statements");

    const { data, isPending, isError, error, refetch } = useBankTransactions({
        page,
        perPage,
    });

    const {
        mutateAsync: uploadFile,
        isPending: isUploading,
    } = useBucketFileUpload({
        bucketName: "transactions",
        invalidateKeys: [bankTransactionKeys.all],
        successMessage: "Bank transactions uploaded",
        successDescription:
            "Bank transaction file has been processed successfully.",
    });

    const handleFileUpload = async (file) => {
        await uploadFile({ file, description: "Bank transactions PDF" });
    };

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
        <div className="pt-20">
            <DynamicTable
                header={
                    < div className="flex items-center justify-between w-full">
                        <PageTitle
                            text="Bank Transactions"
                            subtitle="Overview of all bank transactions"
                            compact
                        />
                        <div className="flex items-center gap-4">
                            {isUploading && (
                                <span className="text-sm text-muted-foreground">
                                    Uploading & processing...
                                </span>
                            )}

                            <UploadButton
                                onUploadSuccess={handleFileUpload}
                                buttonText="Upload Bank Transactions"
                                disabled={isUploading}
                                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                            />
                            <TimeFilter value={timeRange} onChange={handleTimeChange} />
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
    );
};

export default BankTransactions;
