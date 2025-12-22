import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKufInvoices } from "@/queries/Kuf";
import { useState } from "react";
import { getKufColumns } from "@/components/tables/columns/kufColumns";
import { Spinner } from "@/components/ui/spinner";
import IsError from "@/components/shared-ui/IsError";
import DefaultLayout from "@/layout/DefaultLayout";
import UploadButton from "@/components/shared-ui/UploadButton";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";

const Kuf = () => {
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");
    const perPage = 10;
    const { data, isPending, error, isError, refetch } = useKufInvoices({ page, perPage, timeRange });

    const handleFileUpload = (file) => {
        console.log("File uploaded:", file);

    };

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };
    if (isPending) {
        return (
            <>
                <PageTitle text="Kuf" />
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
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load KUF"
                    showDetails={true}
                />
            </>
        );
    }

    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable columns={getKufColumns((item) => console.log("Action on:", item))} data={data.data ? data.data : []} total={data?.total || 0}
                    header={
                        <div className="flex items-center justify-between">
                            <PageTitle text="Kuf"
                                subtitle="Overview of all KUF Purchase Invoices"
                                compact
                            />
                            <div className="flex items-center gap-4">
                                <UploadButton
                                    onUploadSuccess={handleFileUpload}
                                    buttonText="Upload Kuf"
                                    className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                                />
                                <TimeFilter
                                    value={timeRange}
                                    onChange={handleTimeChange}
                                />
                            </div>
                        </div>
                    }
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                />
            </div>
        </DefaultLayout>
    );
};

export default Kuf;
