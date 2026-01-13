import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { usePartners, useDeletePartner } from "@/queries/partners";
import { Input } from "@/components/ui/input";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import ConfirmDeleteDialog from "@/components/shared-ui/modals/ConfirmDeleteModal";
import useTableSearch from "@/hooks/use-table-search";

const Partners = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [partnerType, setPartnerType] = useState("all");
    const [timeRange, setTimeRange] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, partnerId: null, partnerName: '' });
    const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner();

    const { search, debouncedSearch, setSearch, clearSearch } = useTableSearch({
        delay: 400,
        setPage,
    });

    const { data, isPending, error, isError, refetch } = usePartners({
        page,
        perPage,
        type: partnerType === "all" ? null : partnerType,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {})
    });

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
            deletePartner(deleteDialog.partnerId, {
                onSuccess: () => {
                    setDeleteDialog({
                        open: false,
                        partnerId: null,
                        partnerName: ''
                    });
                }
            });
        }
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
                        <PageTitle text="Partners" subtitle="Manage business partners" compact />
                        <div className="flex items-center gap-4">
                            <TimeFilter value={timeRange} onChange={handleTimeChange} />
                        </div>
                    </div>
                }
                toolbar={{
                    search: searchBar,
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
                                clearSearch();
                                setPage(1);
                            }}
                        >
                            Clear filters
                        </Button>
                    ),
                }}
                columns={getPartnersColumns(handleTableAction)}
                data={data?.data ?? []}
                total={data?.total ?? 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog(prev => ({ ...prev, open }))
                }
                title="Confirm Deletion"
                description={`Are you sure you want to delete partner "${deleteDialog.partnerName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                disabled={isDeleting}
            />
        </div>
    );
};

export default Partners;