import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList, kifKeys, useKifInvoiceTypes } from "@/queries/KifQueries";
import { getKifColumns } from "@/components/tables/columns/kifColumns";
import { useMemo, useState } from "react";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import UploadButton from "@/components/shared-ui/UploadButton";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
const Kif = () => {
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");
    const [invoiceType, setInvoiceType] = useState("all");
    const perPage = 10;

    const { data, isPending, isError, error, refetch } = useKifList({
        page,
        perPage,
        invoiceType: invoiceType === "all" ? null : invoiceType,
        timeRange: timeRange === "all" ? null : timeRange,
    });

    const { data: invoiceTypesData, isPending: isInvoiceTypesPending, isError: isInvoiceTypesError } = useKifInvoiceTypes();

    const handleAction = useAction("kif");

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

    const handleTimeChange = (newValue) => {
        const val = newValue || "all";
        setTimeRange(val);
        setPage(1);
    };

    const invoiceTypeOptions = useMemo(() => {
        return (invoiceTypesData?.invoiceTypes || []).map((type) => ({
            label: type,
            value: type,
        }));
    }, [invoiceTypesData?.invoiceTypes]);

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
                            {isUploading && (
                                <div className="flex items-center gap-3">
                                    <Spinner className="w-4 h-4 text-[var(--spurple)]" />
                                    <span className="text-sm text-muted-foreground">
                                        Uploading & processing...
                                    </span>
                                </div>
                            )}

                            <UploadButton
                                onUploadSuccess={handleFileUpload}
                                buttonText="Upload Kif"
                                disabled={isUploading}
                                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                            />

                            <TimeFilter
                                value={timeRange}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>
                }
                toolbar={{
                    filters: (
                        <Select value={invoiceType} onValueChange={(value) => {
                            setInvoiceType(value);
                            setPage(1);
                        }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={isInvoiceTypesPending ? "Loading types..." : isInvoiceTypesError ? "Failed to load types" : "All types"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                {!isInvoiceTypesPending && invoiceTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>))
                                }
                            </SelectContent>
                        </Select>
                    ),
                    button: (
                        <Button variant="outline" onClick={() => {
                            setInvoiceType("all");
                            setPage(1);
                        }}
                        >
                            Clear filters
                        </Button>
                    ),
                }}
                columns={getKifColumns(handleAction)}
                data={data?.data ?? []}
                total={data?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />

        </div>
    );
};

export default Kif;
