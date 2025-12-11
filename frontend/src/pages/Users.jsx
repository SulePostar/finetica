import React from "react";
import DynamicTable from "@/components/table/DynamicTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ActionsDropdown from "@/components/ActionsDropdown";

export default function Users({ onAction }) {
    const data = [
        {
            name: "Temp User",
            email: "temp@example.com",
            role: "Temp Role",
            status: "Pending",
            lastActive: "--",
            actions: "...",
        },
    ];

    const userActions = [
        { key: "action1", label: "Action 1" },
        { key: "action2", label: "Action 2" },
    ];

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => row.original.role,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => row.original.status,
        },
        {
            accessorKey: "lastActive",
            header: "Last Active",
            cell: ({ row }) => row.original.lastActive,
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

    return (
        <div className="w-full px-4 py-6 max-w-full space-y-6">
            <h1 className="text-3xl font-semibold">User Management Dashboard</h1>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full">
                <Input
                    placeholder="Search..."
                    className="flex-1 min-w-[200px]"
                />

                <select className="w-[180px] border rounded-md px-2 py-2 text-sm">
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>

                <Button variant="outline">Clear filters</Button>
            </div>

            {/* Table */}
            <DynamicTable columns={columns} data={data} />
        </div>
    );
}
