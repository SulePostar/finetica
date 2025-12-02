import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function getKifColumns(onDelete) {
    return [
        {
            id: "index",
            header: "Row",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "invoiceNumber",
            header: "Invoice Number",
            cell: ({ row }) => row.original.invoiceNumber || "—",
        },
        {
            accessorKey: "invoiceType",
            header: "Type",
            cell: ({ row }) => row.original.invoiceType || "—",
        },
        {
            accessorKey: "customerName",
            header: "Customer",
            cell: ({ row }) => row.original.customerName || "—",
        },
        {
            accessorKey: "invoiceDate",
            header: "Invoice Date",
            cell: ({ row }) => {
                const value = row.original.invoiceDate;
                return value ? new Date(value).toLocaleDateString() : "—";
            },
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                const value = row.original.dueDate;
                return value ? new Date(value).toLocaleDateString() : "—";
            },
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => {
                const value = row.original.totalAmount;
                return value != null ? `${parseFloat(value).toFixed(2)} KM` : "—";
            },
        },
        {
            accessorKey: "status",
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
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <Button
                        variant="destructive"
                        onClick={() => onDelete(item)}
                    >
                        Delete
                    </Button>
                );
            },
        },
    ];
}
