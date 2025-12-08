import PageTitle from "@/components/shared-ui/PageTitle";
import { getRolesStatusesColumns } from "@/components/tables/columns/rolesStatusesColumns";
import { useRoles, useStatuses } from "@/queries/rolesAndStatuses";
import RolesStatusesTable from "@/components/tables/RolesStatusesTable";
import { Spinner } from "@/components/ui/spinner";

export default function RoleAndStatusManagement() {
    const columns = getRolesStatusesColumns("roles", (item) => { console.log("Delete", item); }, "role");
    const statuses = getRolesStatusesColumns("statuses", (item) => { console.log("Delete", item); }, "status");

    const { data: rolesData, isPending: rolesPending } = useRoles();
    const { data: statusData, isPending: statusPending } = useStatuses();

    if (statusPending || rolesPending)
        return (
            <div className="flex items-center justify-center h-40">
                <Spinner className="size-10" />
            </div>
        );

    return (
        <div>
            <PageTitle text={"Roles and Statuses"} />

            {/* RESPONSIVE: stack on mobile, side-by-side on larger screens */}
            <div className="flex flex-col md:flex-row gap-6 p-4">
                <RolesStatusesTable
                    columns={columns}
                    data={rolesData.data}
                    title="Roles"
                    placeholder="New role name"
                    onAdd={(name) => { console.log("Add role:", name); }}
                />

                <RolesStatusesTable
                    columns={statuses}
                    data={statusData.data}
                    title="Statuses"
                    placeholder="New status name"
                    onAdd={(name) => { console.log("Add status:", name); }}
                />
            </div>
        </div>
    );
}
