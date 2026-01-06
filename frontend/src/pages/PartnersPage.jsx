import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { usePartners, useDeletePartner } from "@/queries/partners";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import useTableSearch from "@/hooks/use-table-search";

import { notify } from "@/lib/notifications";
import ConfirmDeleteDialog from "@/components/shared-ui/modals/ConfirmDeleteModal";

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
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    });

    const { mutate: deletePartner, isPending: isDeletingPartner } =
        useDeletePartner();

    const deleteTriggerRef = useRef(null);
    const [partnerToDelete, setPartnerToDelete] = useState(null);

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const openDeleteModal = (item) => {
        setPartnerToDelete(item);

        requestAnimationFrame(() => {
            deleteTriggerRef.current?.click();
        });
    };

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
                if (isDeletingPartner) return;
                openDeleteModal(item);
                break;
            default:
                return;
        }
    };

    const handleRowClick = (row, event) => {
        if (event?.target.closest(".actions-dropdown")) return;
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
            {/* Delete confirmation modal */}
            <ConfirmDeleteDialog
                disabled={isDeletingPartner}
                title="Delete partner?"
                description={
                    partnerToDelete
                        ? `Are you sure you want to delete ${partnerToDelete.shortName}? This action cannot be undone.`
                        : "Are you sure you want to delete this partner? This action cannot be undone."
                }
                trigger={
                    <button
                        ref={deleteTriggerRef}
                        type="button"
                        className="hidden"
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                }
                onConfirm={() => {
                    if (!partnerToDelete) return;

                    deletePartner(partnerToDelete.id, {
                        onSuccess: () => {
                            notify.success("Partner deleted", {
                                description: `${partnerToDelete.shortName} has been removed.`,
                            });
                        },
                        onError: (err) => {
                            const message =
                                err?.response?.data?.message ?? "Failed to delete partner";
                            notify.error("Delete failed", { description: message });
                        },
                    });
                }}
                confirmText={isDeletingPartner ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />

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
                onRowClick={(row, event) => handleRowClick(row, event)}
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
