import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";

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
            meta: { isComponent: true },
            cell: ({ row }) => {
                const approved = row.original.approvedAt || row.original.approvedBy;
                const value = approved ? "approved" : "pending";

                return <ReviewStatusBadge status={value} />
            },
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => (
                <Button variant="destructive" onClick={() => onDelete(row.original)}>
                    Delete
                </Button>
            ),
        },
    ];
}