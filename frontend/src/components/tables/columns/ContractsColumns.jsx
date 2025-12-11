import { Badge } from "@/components/ui/badge";
import ActionsDropdown from "@/components/ActionsDropdown";

export function getContractsColumns(onAction) {
    const contractActions = [
        { key: "action1", label: "Action 1" },
        { key: "action2", label: "Action 2" },
        { key: "action3", label: "Action 3" },
    ];

    return [
        {
            accessorKey: "partner_name",
            header: "Partner",
            cell: ({ row }) => row.original.partner_name || row.original.businessPartner?.name || "—"
        },
        {
            accessorKey: "contract_number",
            header: "Contract Number",
            cell: ({ row }) => row.original.contract_number || row.original.contractNumber || "—"
        },
        {
            accessorKey: "contract_type",
            header: "Type",
            cell: ({ row }) => row.original.contract_type || row.original.contractType || "—"
        },
        {
            accessorKey: "start_date",
            header: "Start Date",
            cell: ({ row }) => {
                const date = row.original.start_date || row.original.startDate;
                return date ? new Date(date).toLocaleDateString() : "—";
            }
        },
        {
            accessorKey: "end_date",
            header: "End Date",
            cell: ({ row }) => {
                const date = row.original.end_date || row.original.endDate;
                return date ? new Date(date).toLocaleDateString() : "—";
            }
        },
        {
            accessorKey: "is_active",
            header: "Status",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const isActive = row.original.is_active ?? row.original.isActive ?? false;
                const statusStyles = {
                    active: "bg-chart-2 text-primary-foreground",
                    inactive: "bg-muted text-muted-foreground",
                };
                const status = isActive ? "active" : "inactive";
                const color = statusStyles[status];
                return <Badge className={color}>{status}</Badge>;
            },
        },
        {
            accessorKey: "amount",
            header: "Amount",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const amount = row.original.amount;
                return amount ? `${parseFloat(amount).toFixed(2)}` : "—";
            },
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                return (
                    <ActionsDropdown
                        item={row.original}
                        actions={contractActions}
                        onAction={onAction}
                    />
                )
            },
        },
    ];
}
