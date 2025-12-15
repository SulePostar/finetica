import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";
import DefaultLayout from "@/layout/DefaultLayout";
import { usePartners } from "@/queries/partners";
import { useState } from "react";

const Partners = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, isPending, error, isError, refetch } = usePartners({ page, perPage });

    if (isPending) {
        return (
            <>
                <PageTitle text="Partners" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageTitle text="Partners" />
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Partners"
                    showDetails={true}
                />
            </>
        );
    }
    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable
                    header={
                        <div className="flex items-center justify-between">
                            <PageTitle
                                text="Partners"
                                subtitle="Partners Management Dashboard"
                                compact
                            />
                        </div>
                    }
                    columns={getPartnersColumns((item) => console.log("Action on:", item))}
                    data={data.data ?? []}
                    total={data?.total || 0}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}

                />
            </div>
        </DefaultLayout>
    );
};

export default Partners;
