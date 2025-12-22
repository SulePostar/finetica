import PageTitle from "@/components/shared-ui/PageTitle";
import { getRolesStatusesColumns } from "@/components/tables/columns/rolesStatusesColumns";
import { useCreateRole, useRoles, useStatuses, useCreateUserStatus, useDeleteRole } from "@/queries/rolesAndStatuses";
import RolesStatusesTable from "@/components/tables/RolesStatusesTable";
import { Spinner } from "@/components/ui/spinner";
import DefaultLayout from "@/layout/DefaultLayout";
import { notify } from "@/lib/notifications";
import IsError from '@/components/shared-ui/IsError.jsx';
import React from 'react';


export default function RoleAndStatusManagement() {
    const deleteUserRoleMutation = useDeleteRole();
    const createRoleMutation = useCreateRole();
    const columns = getRolesStatusesColumns(
        "roles",
        (item) =>
            deleteUserRoleMutation.mutate(item.id, {
                onSuccess: () => {
                    notify.success("Role deleted", {
                        description: "The role has been permanently removed.",
                    });
                },
                onError: (err) => {
                    const message =
                        err?.response?.data?.message ??
                        "Failed to delete role";

                    notify.error("Delete failed", {
                        description: message,
                    });
                },
            }),
        "role"
    );
    const statuses = getRolesStatusesColumns("statuses", (item) => { console.log("Delete", item); }, "status");
    const createUserStatus = useCreateUserStatus();

    const { data: rolesData, isPending: rolesPending, isError: isRolesError, error: rolesError, refetch: rolesRefetch  } = useRoles();
    const { data: statusData, isPending: statusPending, isError: isStatusError, error: statusError, refetch: statusRefetch } = useStatuses();

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

    if(isRolesError) {
      return (
        <div>
          <IsError
            error={rolesError}
            onRetry={() => rolesRefetch()}
            title="Failed to load Roles"
            showDetails={true}
          />
        </div>
      );
    }

  if(isStatusError) {
    return (
      <div>
        <IsError
          error={statusError}
          onRetry={() => statusRefetch()}
          title="Failed to load Statuses"
          showDetails={true}
        />
      </div>
    );
  }

    return (
        <DefaultLayout>
            <div className="px-4 md:px-6 lg:px-8">
                <PageTitle text={"Roles and Statuses"} />

                <div className="flex flex-col 2xl:flex-row gap-6 p-4">

                    <RolesStatusesTable
                        columns={columns}
                        data={rolesData.data}
                        title="Roles"
                        placeholder="New role name"
                        onAdd={(name) => {
                            createRoleMutation.mutate(name, {
                                onSuccess: () => {
                                    console.log(`Role "${name}" created successfully!`);
                                },
                                onError: (error) => {
                                    console.log(`Error creating role: ${error.message}`);
                                }
                            });
                        }}
                    />

                    <RolesStatusesTable
                        columns={statuses}
                        data={statusData.data}
                        title="Statuses"
                        placeholder="New status name"

                        onAdd={(name) => {
                            createUserStatus.mutate(name, {});
                        }}
                    />
                </div>
            </div>

        </DefaultLayout>
    );
}
