import ActionsDropdown from "@/components/ActionsDropdown";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { formatValue } from "@/helpers/formatValue";

// 1. Added 'isAdmin' parameter here
export function getPartnersColumns(onAction, isAdmin) {

    // 2. Start with actions everyone is allowed to see
    const partnersActions = [
        { key: "view", label: "View" },
        { key: "edit", label: "Edit" },
    ];

    // 3. Only add 'Delete' if the user is an admin
    if (isAdmin) {
        partnersActions.push({
            key: "delete",
            label: "Deactivate",
            className: "text-destructive focus:text-destructive focus:bg-destructive/10"
        });
    }
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
                        onAction={(action, item, event) => {
                            if (event) {
                                event.stopPropagation();
                                event.preventDefault();
                            }
                            onAction(action, item);
                        }}
                    />
                )
            },
        },
    ];
}
