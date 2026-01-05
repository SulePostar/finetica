import IsError from "@/components/shared-ui/IsError";
import PageTitle from "@/components/shared-ui/PageTitle";
import DynamicTable from "@/components/table/DynamicTable";
import { getPartnersColumns } from "@/components/tables/columns/PartnersColumns";
import { Spinner } from "@/components/ui/spinner";
import { usePartners, useDeletePartner } from "@/queries/partners";
import { useState, useCallback, useRef } from "react";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useNavigate } from "react-router-dom";
import { useAction } from "@/hooks/use-action";
import ConfirmDeleteDialog from "@/components/shared-ui/modals/ConfirmDeleteModal";
const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [timeRange, setTimeRange] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, partnerId: null, partnerName: '' });
    const deleteTriggerRef = useRef(null);
    const { data, isPending, error, isError, refetch } = usePartners({ page, perPage });
    const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner();
    const handleTimeChange = (newValue) => {
        setTimeRange(newValue);
        setPage(1);
    };

    const handleAction = useAction('partners');
    const handleTableAction = useCallback((action, data) => {
        switch (action) {
            case 'delete':
                setDeleteDialog({
                    open: true,
                    partnerId: data?.id,
                    partnerName: data?.shortName || data?.name || 'this partner'
                });
                if (deleteTriggerRef.current) {
                    deleteTriggerRef.current.click();
                }
                break;
            case 'view':
                navigate(`/partners/${data.id}`);
                break;
            case 'edit':
                break;
            default:
                handleAction(action, data);
        }
    }, [navigate, handleAction]);

    const handleConfirmDelete = () => {
        if (deleteDialog.partnerId) {
            deletePartner(deleteDialog.partnerId);
        }
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
                columns={getPartnersColumns(handleTableAction)}
                data={data.data ?? []}
                total={data?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
            <div className="hidden" aria-hidden="true">
                <ConfirmDeleteDialog
                    trigger={<button ref={deleteTriggerRef} type="button">Trigger</button>}
                    title="Confirm Deletion"
                    description={`Are you sure you want to delete partner "${deleteDialog.partnerName}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    disabled={isDeleting}
                />
            </div>
        </div>
    );
};

export default Partners;
