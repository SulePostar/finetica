
import PageTitle from "@/components/shared-ui/PageTitle";
import { getRolesStatusesColumns } from "@/components/tables/columns/rolesStatusesColumns";
import { useRoles, useStatuses } from "@/queries/rolesAndStatuses";
import RolesStatusesTable from "@/components/tables/RolesStatusesTable";
import { Spinner } from "@/components/ui/spinner";

export default function RoleAndStatusManagement() {
    const columns = getRolesStatusesColumns("roles", (item) => { console.log("Delete", item); }, "role");
    const statuses = getRolesStatusesColumns("statuses", (item) => { console.log("Delete", item); }, "status");

    const { data: rolesData, isPending: rolesPending, } = useRoles();
    const { data: statusData, isPending: statusPending, } = useStatuses();

    if (statusPending || rolesPending) {
        return (
            <>
                <div className="px-4 md:px-6 lg:px-8"></div>
                <PageTitle text="Roles and Statuses" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

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
