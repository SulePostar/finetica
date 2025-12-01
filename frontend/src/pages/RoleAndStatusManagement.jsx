
import PageTitle from "@/components/shared-ui/PageTitle";
import { getRolesStatusesColumns } from "@/components/tables/columns/rolesStatusesColumns";
import { useRoles, useStatuses } from "@/queries/rolesAndStatuses";
import RolesStatusesTable from "@/components/tables/RolesStatusesTable";

export default function RoleAndStatusManagement() {
    const columns = getRolesStatusesColumns("roles", (item) => { console.log("Delete", item); }, "role");
    const statuses = getRolesStatusesColumns("statuses", (item) => { console.log("Delete", item); }, "status");

    const { data: rolesData, isPending: rolesPending, } = useRoles();
    const { data: statusData, isPending: statusPending, } = useStatuses();

    if (statusPending || rolesPending) return <p>Loading...</p>;

    return (
        <div>
            <PageTitle text={"Roles and Statuses"} />
            <div className="flex gap-6 p-4">
                <RolesStatusesTable columns={columns} data={rolesData.data} title="Roles" placeholder="New role name" onAdd={(name) => { console.log("Add role:", name); }} />
                <RolesStatusesTable columns={statuses} data={statusData.data} title="Statuses" placeholder="New status name" onAdd={(name) => { console.log("Add status:", name); }} />
            </div>
        </div>
    );
}
