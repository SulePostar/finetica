import ActionsDropdown from "@/components/ActionsDropdown";
import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatDateTime } from "@/helpers/formatDate";
import { formatValue } from "@/helpers/formatValue";

export function getUsersColumns(onAction, currentUserId, isAdmin) {
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
            cell: ({ row }) => {
                const role = row.original.roleName;
                return role ? formatValue(capitalizeFirst(role)) : "-";
            },
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
            cell: ({ row }) => {
                const status = row.original.statusName;
                return status ? <ReviewStatusBadge status={status} /> : <Badge variant="outline">Unknown</Badge>;
            },
        },
        {
            accessorKey: "isEnabled",
            header: "Enabled",
            meta: { isComponent: true },
            cell: ({ row }) => (
                <Badge className={row.original.isEnabled ? "bg-chart-2 dark:bg-chart-2 text-black dark:text-white" : "bg-destructive text-black dark:text-white"}>
                    {row.original.isEnabled ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            meta: { isComponent: true },
            cell: ({ row }) => {
                const user = row.original;
                const statusName = user.statusName || "";
                const isPending = statusName.toLowerCase() === "pending";

                const userActions = [];

                if (isAdmin && isPending) {
                    userActions.push(
                        { key: "Approve", label: "Approve" },
                        { key: "Reject", label: "Reject" }
                    );
                }

                userActions.push(
                    { key: "view", label: "View" },
                    {
                        key: "toggleStatus",
                        label: user.isEnabled ? "Deactivate" : "Restore",
                        className: user.isEnabled ? "text-destructive" : "",
                    }
                );

                return (
                    <ActionsDropdown
                        item={user}
                        actions={userActions}
                        onAction={(key) => onAction(key, user)}
                    />
                );
            },
        },
    ];
}