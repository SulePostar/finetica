import ActionsDropdown from "@/components/ActionsDropdown";


export function getUsersColumns(onAction) {
    const userActions = [
        { key: "action1", label: "Action 1" },
        { key: "action2", label: "Action 2" },
    ];
    return [
        {
            accessorKey: "fullName",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.fullName}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "roleId",
            header: "Role",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    ID: {row.original.roleId}
                </span>
            ),
        },
        {
            accessorKey: "statusId",
            header: "Status",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    ID: {row.original.statusId}
                </span>
            ),
        },
        {
            accessorKey: "lastLoginAt",
            header: "Last Active",
            cell: ({ row }) => (
                <span className="text-gray-500">
                    {row.original.lastLoginAt || "--"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <ActionsDropdown
                        item={row.original}
                        actions={userActions}
                        onAction={onAction}
                    />
                )
            },
        },
    ];
}