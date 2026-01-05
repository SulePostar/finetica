import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";
import { usePartners, useDeletePartner } from "@/queries/partners";
import { useRef, useState } from "react";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notifications";
import ConfirmDeleteDialog from "@/components/shared-ui/modals/ConfirmDeleteModal";

const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;

    const [timeRange, setTimeRange] = useState("all");
    const { data, isPending, error, isError, refetch } = usePartners({ page, perPage });

    const { mutate: deletePartner, isPending: isDeletingPartner } = useDeletePartner();

    const deleteTriggerRef = useRef(null);
    const [partnerToDelete, setPartnerToDelete] = useState(null);

    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const openDeleteModal = (item) => {
        setPartnerToDelete(item);

        // ConfirmDeleteDialog requires a trigger element; we use a hidden button and click it programmatically.
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
                columns={getPartnersColumns(handleAction)}
                data={data?.data ?? []}
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