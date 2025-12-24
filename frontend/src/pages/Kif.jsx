import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList } from "@/queries/KifQueries";
import { getKifColumns } from "@/components/tables/columns/kifColumns";
import { useState } from "react";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import UploadButton from "@/components/shared-ui/UploadButton";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";

const Kif = () => {
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");
    const perPage = 10;
    const { data, isPending, isError, error, } = useKifList({ page, perPage });
    const handleAction = useAction('kif');

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
                <PageTitle text="Kif" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageTitle text="Kif" />
                <IsError error={error} />
            </>
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
                }
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
