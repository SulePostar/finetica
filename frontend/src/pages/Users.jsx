import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUsers } from "@/queries/userQueries";
import { useRoles, useStatuses } from "@/queries/rolesAndStatuses";
import { getUsersColumns } from "@/components/tables/columns/UsersColumns";
import { Spinner } from "@/components/ui/spinner";
import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";
import { useNavigate } from "react-router-dom";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";

import DefaultLayout from "@/layout/DefaultLayout";

const Users = () => {
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);
    const perPage = 10;

    const { data: response, isPending, isError, error, refetch } = useUsers({
        page, perPage, roleId: selectedRole === "all" ? null : selectedRole,
        statusId: selectedStatus === "all" ? null : selectedStatus
    });
    const { data: rolesResponse } = useRoles();
    const { data: statusesResponse } = useStatuses();
    const usersData = response?.data || [];
    const totalUsers = response?.total || 0;
    const rolesData = rolesResponse?.data || [];
    const statusesData = statusesResponse?.data || [];
    const navigate = useNavigate();

    const handleUserClick = (user) => {
        navigate(`/profile/${user.id}`);
    }

    if (isPending) {
        return <>
            <PageTitle text="User Management Dashboard" />
            <div className="flex items-center justify-center h-40">
                <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
            </div>
        </>
    }
    if (isError) {
        return (
            <div>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load user"
                    showDetails={true}
                />
            </div>
        );
    }

    return (
        <DefaultLayout>
            <div className="pt-20">
                <DynamicTable
                    header={
                        <PageTitle
                            text="Users"
                            subtitle="Users management dashboard"
                            compact
                        />}
                    toolbar={{
                        search:
                            <Input
                                placeholder="Search..."
                                className="w-full" />,
                        filters: (
                            <>
                                <Select value={selectedStatus}
                                    onValueChange={(value) => {
                                        setSelectedStatus(value);
                                        setPage(1);
                                    }}>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        {statusesData.map(s => <SelectItem key={s.id} value={s.id.toString()}>
                                            {capitalizeFirst(s.status)}
                                        </SelectItem>)
                                        }
                                    </SelectContent>
                                </Select>

                                <Select value={selectedRole} onValueChange={(value) => {
                                    setSelectedRole(value);
                                    setPage(1);
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        {rolesData.map(r => <SelectItem key={r.id} value={r.id.toString()}>
                                            {capitalizeFirst(r.role)}
                                        </SelectItem>)
                                        }
                                    </SelectContent>
                                </Select>
                            </>
                        ),
                        button: (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedRole("all");
                                    setSelectedStatus("all");
                                    setPage(1);
                                }}
                            >
                                Clear filters
                            </Button>
                        )
                    }}
                    columns={getUsersColumns()}
                    data={usersData}
                    total={totalUsers}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                    onRowClick={handleUserClick}
                />

            </div>

        </DefaultLayout>
    );
}


export default Users;