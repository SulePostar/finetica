import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import ActionsDropdown from "@/components/ActionsDropdown";
import { formatDateTime } from "@/helpers/formatDate";

export function getBankTransactionsColumns(onAction) {
    const bankStatementsActions = [
        { key: "view", label: "View" },
        { key: "approve", label: "Approve" },
        { key: "download", label: "Download" },
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
            accessorKey: "totalBaseAmount",
            header: "Base Amount",
            cell: ({ row }) => {
                return <span>{row.original.totalBaseAmount || "—"}</span>;
            },
        },
        {
            accessorKey: "totalVatAmount",
            header: "VAT amount",
            cell: ({ row }) => {
                return <span>{row.original.totalVatAmount || "—"}</span>;
            },
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => {
                return (
                    <span>
                        {row.original.totalAmount || "—"}
                    </span>
                );
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
