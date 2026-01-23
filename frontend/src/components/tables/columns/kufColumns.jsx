import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import ActionsDropdown from "@/components/ActionsDropdown";

export function getKufColumns(onAction) {
    const kufActions = [
        { key: "view", label: "View" },
        { key: "action2", label: "Action 2" },
        { key: "action3", label: "Action 3" },
        { key: "action4", label: "Action 4" },
    ];

    return [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice Number",
            cell: ({ row }) => formatValue(row.original.invoiceNumber)
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
            accessorKey: "totalBaseAmount",
            header: "Base Amount",
            cell: ({ row }) => {
                return `${formatValue(row.original.totalBaseAmount)}`;
            },
        },
        {
            accessorKey: "totalVatAmount",
            header: "VAT Amount",
            cell: ({ row }) => {
                return `${formatValue(row.original.totalVatAmount)}`;
            },
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => {
                return formatValue(row.original.totalAmount);
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
                return (
                    <ActionsDropdown
                        item={row.original}
                        actions={kufActions}
                        onAction={onAction}
                    />
                )
            },
        },
    ];
}