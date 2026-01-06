import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePartners } from "@/queries/partners";
import { useState } from "react";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useNavigate } from "react-router-dom";
import { useAction } from "@/hooks/use-action";
const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [partnerType, setPartnerType] = useState("all");
    const [timeRange, setTimeRange] = useState("all");
    const { data, isPending, error, isError, refetch } = usePartners({ page, perPage, type: partnerType === "all" ? null : partnerType });
    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const handleAction = useAction('partners');

    const handleRowClick = (row) => {
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
        <DynamicTable
            header={
                <div className="flex items-center justify-between w-full">
                    <PageTitle text="Partners" subtitle="Manage business partners" compact />
                    <div className="flex items-center gap-4">
                        <TimeFilter value={timeRange} onChange={handleTimeChange} />
                    </div>
                </div>
            }
            toolbar={{
                filters: (
                    <>
                        <Select
                            value={partnerType}
                            onValueChange={(value) => {
                                setPartnerType(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All partners" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All partners</SelectItem>
                                <SelectItem value="supplier">Suppliers</SelectItem>
                                <SelectItem value="customer">Customers</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                ),
                button: (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setPartnerType("all");
                            setTimeRange("all");
                            setPage(1);
                        }}
                    >
                        Clear filters
                    </Button>
                ),
            }}
            columns={getPartnersColumns(handleAction)}
            data={data?.data ?? []}
            total={data?.total ?? 0}
            page={page}
            perPage={perPage}
            onPageChange={setPage}
            onRowClick={handleRowClick}
        />
    );
};

export default Partners;
