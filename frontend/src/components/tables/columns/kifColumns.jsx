import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";

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
            cell: ({ row }) => formatValue(row.original.invoiceNumber),
        },
        {
            accessorKey: "invoiceType",
            header: "Type",
            cell: ({ row }) => formatValue(row.original.invoiceType),
        },
        {
            accessorKey: "customerName",
            header: "Customer",
            cell: ({ row }) => formatValue(row.original.customerName),
        },
        {
            accessorKey: "invoiceDate",
            header: "Invoice Date",
            cell: ({ row }) => formatDateTime(row.original.invoiceDate),
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => formatDateTime(row.original.dueDate),
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => {
                const value = row.original.totalAmount;
                return value != null ? `${parseFloat(value).toFixed(2)}` : "—";
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

                return <Badge className={color}>{capitalizeFirst(value)}</Badge>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button variant="destructive" onClick={() => onDelete(row.original)}>
                    Delete
                </Button>
            ),
        },
    ];
}