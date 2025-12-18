import ActionsDropdown from "@/components/ActionsDropdown";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { formatValue } from "@/helpers/formatValue";

export function getPartnersColumns(onAction) {
    const partnersActions = [
        { key: "view", label: "View" },
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" },

    ];

    return [
        {
            accessorKey: "shortName",
            header: "Short Name",
            cell: ({ row }) => formatValue(row.original.shortName),

        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => formatValue(row.original.email),

        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => formatValue(row.original.type),

        },
        {
            accessorKey: "bankName",
            header: "Bank Name",
            cell: ({ row }) => formatValue(row.original.bankName),

        },
        {
            accessorKey: "status",
            header: "Status",
            meta: { isComponent: true },
            cell: ({ row }) => <ReviewStatusBadge status={row.original.isActive ? 'Active' : 'Inactive'} />,

        },
        {
            accessorKey: "paymentTerms",
            header: "Payment Terms",
            cell: ({ row }) => formatValue(row.original.paymentTerms),

        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                return (
                    <ActionsDropdown
                        item={row.original}
                        actions={partnersActions}
                        onAction={onAction}
                    />
                )
            },
        },];
}