import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import ActionsDropdown from "@/components/ActionsDropdown";
import { formatDateTime } from "@/helpers/formatDate";

export function getBankTransactionsColumns(onAction) {
    const bankStatementsActions = [
        { key: "view", label: "View" },
        { key: "action2", label: "Action 2" },
        { key: "action3", label: "Action 3" },
    ];
    return [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => formatDateTime(row.original.date),
        },
        {
            accessorKey: "TransactionCategory.name",
            header: "Category",
            cell: ({ row }) => row.original.TransactionCategory?.name || "—",
        },
        {
            accessorKey: "accountNumber",
            header: "Account Number",
            cell: ({ row }) => row.original.accountNumber || "—",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => row.original.description || "—",
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const amount = row.original.amount;
                return amount ? `${parseFloat(amount).toFixed(2)}` : "—";
            },
        },
        {
            id: "status",
            header: "Status",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const approved = row.original.approvedAt || row.original.approvedBy;
                const value = approved ? "approved" : "pending";
                return (
                    <div className="flex items-center justify-center">
                        <ReviewStatusBadge status={value} />
                    </div>
                );
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
                        actions={bankStatementsActions}
                        onAction={onAction}
                    />
                )
            },
        },
    ];
}
