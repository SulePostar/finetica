import ActionsDropdown from "@/components/ActionsDropdown";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";

export function getUsersColumns(onAction) {
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
            accessorKey: "isEnabled",
            header: "Enabled",
            meta: { isComponent: true },
            cell: ({ row }) => (
                < Badge className={row.original.isEnabled ? "bg-chart-2 dark:bg-chart-2 text-black dark:text-white" : "bg-destructive text-black dark:text-white"} >
                    {row.original.isEnabled ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const userActions = [
                    { key: "view", label: "View" },
                    {
                        key: "toggleStatus",
                        label: row.original.isEnabled ? "Deactivate" : "Restore",
                        className: row.original.isEnabled ? "text-destructive" : "",
                    },
                ];


                return (
                    <ActionsDropdown
                        item={row.original}
                        actions={userActions}
                        onAction={(key) => onAction(key, row.original)}
                    />
                )
            },
        },
    ];
}