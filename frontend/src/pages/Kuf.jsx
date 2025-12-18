import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKufInvoices } from "@/queries/Kuf";
import { useState } from "react";
import { getKufColumns } from "@/components/tables/columns/kufColumns";
import { Spinner } from "@/components/ui/spinner";
import IsError from "@/components/shared-ui/IsError";
import DefaultLayout from "@/layout/DefaultLayout";
import UploadButton from "@/components/shared-ui/UploadButton";
import { useAction } from "@/hooks/use-action";

const Kuf = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, isPending, error, isError, refetch } = useKufInvoices({ page, perPage });
    const handleAction = useAction('kuf');

    const handleFileUpload = (file) => {
        console.log("File uploaded:", file);

    };

    if (isPending) {
        return (
            <DefaultLayout>
                <PageTitle text="Kuf" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </DefaultLayout>
        );
    }

    if (isError) {
        return (
            <DefaultLayout>
                <PageTitle text="KUF - Purchase Invoices" />
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load KUF"
                    showDetails={true}
                />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable
                    header={
                        <div className="flex items-center justify-between">
                            <PageTitle
                                text="Kuf"
                                subtitle="Overview of all Kuf files"
                                compact
                            />
                            <UploadButton
                                onUploadSuccess={handleFileUpload}
                                buttonText="Upload"
                                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                            />
                        </div>
                    }
                    columns={getKufColumns(handleAction)}
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

export default Kuf;
