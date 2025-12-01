
import PageTitle from "@/components/shared-ui/PageTitle";
import { getRolesPermissionsColumns } from "@/components/tables/columns/rolesPermissionsColumns";
import RolesPermissionsTable from "@/components/tables/RolesPermissionsTable";

export default function RoleAndStatusManagement() {
    const columns = getRolesPermissionsColumns("roles", (item) => { console.log("Delete", item); });
    const permissions = getRolesPermissionsColumns("permissions", (item) => { console.log("Delete", item); });

    const rolesData = [];
    const permissionsData = [];

    return (
        <div>
            <PageTitle text={"Roles and Permissions"} />
            <div className="flex gap-6 p-4">
                <RolesPermissionsTable columns={columns} data={rolesData} title="Roles" placeholder="New role name" onAdd={(name) => { console.log("Add role:", name); }} />
                <RolesPermissionsTable columns={permissions} data={permissionsData} title="Permissions" placeholder="New role name" onAdd={(name) => { console.log("Add role:", name); }} />
            </div>
        </div>
    );
}
