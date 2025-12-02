import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function getBankStatementsColumns(onDelete) {
    return [
        {
            id: "index",
            header: "Row",
            cell: ({ row }) => row.index + 1,
        },
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
            cell: ({ row }) => {
                const approved = row.original.approvedAt || row.original.approvedBy;
                const value = approved ? "approved" : "pending";

                const statusStyles = {
                    approved: "bg-chart-2 text-primary-foreground",
                    pending: "bg-chart-4 text-primary-foreground",
                    rejected: "bg-destructive text-primary-foreground",
                    default: "bg-muted text-muted-foreground",
                };

                const color = statusStyles[value] || statusStyles.default;

                return (
                    <Badge className={color}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Badge>
                );
            },
        },
    ];
}
