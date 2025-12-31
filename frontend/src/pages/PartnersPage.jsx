import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePartners } from "@/queries/partners";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import useTableSearch from "@/hooks/use-table-search";

const perPage = 10;

const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");

    const { search, debouncedSearch, setSearch, clearSearch } = useTableSearch({
        delay: 400,
        setPage,
    });

    const { data, isPending, error, isError, refetch } = usePartners({
        page,
        perPage,
        search: debouncedSearch
    });

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const handleAction = useAction('partners');

    const handleRowClick = (row) => {
        navigate(`/partners/${row.id}`);
    };

    const searchBar = (
        <Input
            placeholder="Search by email or short name"
            className="w-full md:flex-1 min-w-[200px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );

    if (isPending && page === 1 && !debouncedSearch) {
        return (
            <div className="pt-20">
                <PageTitle text="Partners" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 text-[var(--spurple)]" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="pt-20">
                <PageTitle text="Partners" />
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Partners"
                    showDetails={true}
                />
            </div>
        );
    }

    return (
        <div className="pt-20">
            <DynamicTable
                header={
                    <div className="flex items-center justify-between w-full">
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
                toolbar={{
                    search: searchBar,
                    button: (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setTimeRange("all");
                                clearSearch();
                            }}
                        >
                            Clear filters
                        </Button>
                    ),
                }}
                columns={getPartnersColumns(handleAction)}
                data={data?.data ?? []}
                total={data?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onRowClick={handleRowClick}
            />

            {isPending && (
                <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-white/40">
                    <Spinner className="w-12 h-12 text-[var(--spurple)]" />
                </div>
            )}
        </div>
    );
};

export default Partners;