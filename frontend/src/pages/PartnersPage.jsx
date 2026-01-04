import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";
import { usePartners, useDeletePartner } from "@/queries/partners";
import { useState } from "react";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useNavigate } from "react-router-dom";
import { useAction } from "@/hooks/use-action";
const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [timeRange, setTimeRange] = useState("all");
    const { data, isPending, error, isError, refetch } = usePartners({ page, perPage });
    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const deletePartner = useDeletePartner();

    const handleAction = (action, item, event) => {
        event?.stopPropagation();
        switch (action) {
            case "view":
                navigate(`/partners/${item.id}`);
                break;
            case "edit":
                navigate(`/partners/${item.id}/edit`);
                break;
            case "delete":
                if (confirm(`Are you sure you want to delete ${item.shortName}?`)) {
                    deletePartner.mutate(item.id);
                }
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
    };

    const handleRowClick = (row, event) => {
        if (event?.target.closest(".actions-dropdown")) {
            return;
        }
        navigate(`/partners/${row.id}`);
    };

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
        <div className="pt-20">
            <DynamicTable
                header={
                    < div className="flex items-center justify-between w-full">
                        <PageTitle
                            text="Partners"
                            subtitle="Manage business partners"
                            compact
                        />
                        <div className="flex items-center gap-4">
                            <TimeFilter
                                value={timeRange}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>
                }
                columns={getPartnersColumns(handleAction)}
                data={data.data ?? []}
                total={data?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onRowClick={(row, event) => handleRowClick(row, event)}
            />
        </div>
    );
};

export default Partners;
