import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList, kifKeys } from "@/queries/KifQueries";
import { getKifColumns } from "@/components/tables/columns/kifColumns";
import { useState } from "react";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import UploadButton from "@/components/shared-ui/UploadButton";
import DefaultLayout from "@/layout/DefaultLayout";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";
import { useQueryToast } from "@/hooks/use-query-toast";

const Kif = () => {
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");
    const perPage = 10;
    const { data, isPending, isError, error, refetch } = useKifList({ page, perPage });
    const handleAction = useAction('kif');

    const {
        mutateAsync: uploadFile,
        isPending: isUploading,
    } = useBucketFileUpload({
        bucketName: "kif",
        invalidateKeys: [kifKeys.all],
        successMessage: "Kif file uploaded",
        successDescription: "Kif file has been processed successfully.",
    });

    const handleFileUpload = async (file) => {
        await uploadFile({ file, description: "Kif file" });
    };

    useQueryToast({
        isPending,
        isError,
        data,
        error,
        successMessage: "Kif files loaded",
        successDescription: "All Kif files have been fetched successfully.",
        errorMessage: "Failed to load Kif files",
    });

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };
    if (isPending) {
        return (
            <>
                <PageTitle text="Kif" />
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
                    title="Failed to load Kif files"
                    showDetails={true}
                />
            </div>
        );
    }

    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable
                    header={
                        < div className="flex items-center justify-between w-full">
                            <PageTitle
                                text="Kif"
                                subtitle="Overview of all Kif files"
                                compact
                            />
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    {isUploading && (
                                        <div className="flex items-center gap-2">
                                            <Spinner className="w-4 h-4 text-[var(--spurple)]" />
                                            <span className="text-sm text-muted-foreground">
                                                Uploading & processing...
                                            </span>
                                        </div>
                                    )}

                                    <UploadButton
                                        onUploadSuccess={handleFileUpload}
                                        buttonText="Upload Kif"
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
                    columns={getKifColumns(handleAction)}
                    data={data?.data ?? []}
                    total={data?.total || 0}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                />

            </div>
        </DefaultLayout>
    );
};

export default Kif;
