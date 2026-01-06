import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

import { useKufInvoices, kufKeys } from "@/queries/Kuf";
import { getKufColumns } from "@/components/tables/columns/kufColumns";

import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";

const Kuf = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [timeRange, setTimeRange] = useState("all");

    const handleAction = useAction("kuf");
    const { data, isPending, isError, error, refetch } = useKufInvoices({ page, perPage, timeRange });

    const { mutateAsync: uploadFile, isPending: isUploading } = useBucketFileUpload({
        bucketName: "kuf",
        invalidateKeys: [kufKeys.all],
        successMessage: "KUF uploaded",
        successDescription: "KUF file has been processed successfully.",
    });

    const handleFileUpload = async (file) => {
        await uploadFile({ file, description: "KUF purchase invoices" });
    };

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    if (isPending) {
        return (
            <>
                <PageTitle text="KUF" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageTitle text="KUF - Purchase Invoices" />
                <IsError error={error} onRetry={() => refetch()} title="Failed to load KUF" showDetails />
            </>
        );
    }

    return (
        <div className="pt-20">
            <DynamicTable
                header={
                    <div className="flex items-center justify-between w-full">
                        <PageTitle text="KUF" subtitle="Overview of all KUF Purchase Invoices" compact />
                        <div className="flex items-center gap-4">
                            {isUploading && (
                                <span className="text-sm text-muted-foreground">Uploading & processing...</span>
                            )}
                            <UploadButton
                                onUploadSuccess={handleFileUpload}
                                buttonText="Upload KUF"
                                disabled={isUploading}
                                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                            />
                            <TimeFilter value={timeRange} onChange={handleTimeChange} />
                        </div>
                    </div>
                }
                columns={getKufColumns(handleAction)}
                data={data?.data ?? []}
                total={data?.total ?? 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </div>
    );
};

export default Kuf;