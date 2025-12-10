import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";

export function getKufColumns(onAction) {
    return [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice Number",
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatValue(row.original.invoiceNumber)}
                </span>
            ),
        },
        {
            accessorKey: "invoiceType",
            header: "Type",
            cell: ({ row }) => formatValue(row.original.invoiceType),
        },
        {
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }) => formatValue(row.original.customer),
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
                return formatValue(row.original.netTotal);
            },
        },
        {
            accessorKey: "review",
            header: "Review",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const approved = row.original.approvedAt || row.original.approvedBy;

                const value = approved ? 'approved' : 'pending';

                return (
                    <ReviewStatusBadge status={value} />
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onAction(item)}
                            >
                                View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => console.log("Download", item)}
                            >
                                Download
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}