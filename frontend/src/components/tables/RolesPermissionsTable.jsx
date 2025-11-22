import React, { useState } from "react";
import { getRolesPermissionsColumns } from "../data-table/columns/rolesPermissionsColumns";
import DataTable from "../data-table/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RolesPermissionsTable = () => {
    const rolesData = [
        { id: 1, name: "Admin" },
        { id: 2, name: "Editor" },
        { id: 3, name: "User" },
    ];

    const permissionsData = [
        { id: 1, name: "approved" },
        { id: 2, name: "pending" },
        { id: 3, name: "rejected" },
        { id: 4, name: "custom" },
    ];

    const rolesColumns = getRolesPermissionsColumns("roles", (item) =>
        console.log("Delete role:", item)
    );

    const permissionsColumns = getRolesPermissionsColumns("permissions", (item) =>
        console.log("Delete permission:", item)
    );

    const [rolesInput, setRolesInput] = useState("");
    const [permissionsInput, setPermissionsInput] = useState("");

    return (
        <div className="py-6">
            <h1 className="text-2xl font-bold mb-6">Roles & Permissions</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3">Roles</h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (rolesInput.trim()) console.log("Add role:", rolesInput);
                            setRolesInput("");
                        }}
                        className="flex gap-2 mb-4"
                    >
                        <Input
                            placeholder="Add role"
                            value={rolesInput}
                            onChange={(e) => setRolesInput(e.target.value)}
                        />
                        <Button type="submit" variant="primary">
                            Add
                        </Button>
                    </form>

                    <DataTable columns={rolesColumns} data={rolesData} />
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3">Permissions</h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (permissionsInput.trim())
                                console.log("Add permission:", permissionsInput);
                            setPermissionsInput("");
                        }}
                        className="flex gap-2 mb-4"
                    >
                        <Input
                            placeholder="Add permission"
                            value={permissionsInput}
                            onChange={(e) => setPermissionsInput(e.target.value)}
                        />
                        <Button type="submit" variant="primary">
                            Add
                        </Button>
                    </form>

                    <DataTable columns={permissionsColumns} data={permissionsData} />
                </div>
            </div>
        </div>
    );
};

export default RolesPermissionsTable;
