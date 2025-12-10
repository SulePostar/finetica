import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";

export function getBankTransactionsColumns(onDelete) {
    return [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = row.original.date;
                return date ? new Date(date).toLocaleDateString() : "—";
            },
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
    ];
}
