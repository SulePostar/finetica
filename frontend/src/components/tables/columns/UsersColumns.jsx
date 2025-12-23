import ActionsDropdown from "@/components/ActionsDropdown";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";

export function getUsersColumns(onAction, isAdmin) {
    const userActions = [
        { key: "Approve", label: "Approve" },
        { key: "Reject", label: "Reject" },
    ];
    return [
        {
            accessorKey: "fullName",
            header: "Name",
            cell: ({ row }) => (
                formatValue(row.original.fullName)
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "roleName",
            header: "Role",
            cell: ({ row }) => (
                formatValue(capitalizeFirst(row.original.roleName))
            ),
        },
        {
            accessorKey: "lastLoginAt",
            header: "Last Active",
            cell: ({ row }) => (
                formatValue(formatDateTime(row.original.lastLoginAt))
            ),
        },

        {
            accessorKey: "statusName",
            header: "Status",
            meta: { isComponent: true },
            cell: ({ row }) => (
                <ReviewStatusBadge status={row.original.statusName} />
            ),
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const user = row.original;
                const showActions = isAdmin

                return showActions ? (
                    <ActionsDropdown
                        item={user}
                        actions={userActions}
                        onAction={onAction}
                    />
                ) : null;
            },
        },
    ];
}