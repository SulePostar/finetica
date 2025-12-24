import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUsers, useUpdateUser } from "@/queries/userQueries";
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
import { useAuth } from '@/context/AuthContext.jsx';

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

    const { user } = useAuth();
    const currentUserRole = user?.roleName?.toLowerCase();
    const isAdmin = currentUserRole === 'admin';
    const { data: statusesResponse } = useStatuses();
    const usersData = response?.data || [];
    const totalUsers = response?.total || 0;
    const rolesData = rolesResponse?.data || [];
    const statusesData = statusesResponse?.data || [];
    const navigate = useNavigate();


    const { mutate: updateUser } = useUpdateUser();

    const handleUserClick = (action, user) => {
        const userActions = {
            Approve: 2,
            Reject: 3,
        };

        const statusId = userActions[action];
        if (statusId) {
            updateUser({
                userId: user.id,
                payload: { statusId },
            });
        }
    };

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
                        <div className="flex flex-col gap-4 w-full">
                            <div>
                                <PageTitle
                                    text="Users"
                                    subtitle="Users management dashboard"
                                    compact
                                />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
                                <Input
                                    placeholder="Search..."
                                    className="w-full md:flex-1 min-w-[200px]"
                                />

                                <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
                                    <Select value={selectedStatus} onValueChange={(value) => {
                                        setSelectedStatus(value);
                                        setPage(1);
                                    }}>
                                        <SelectTrigger className="w-[140px] md:w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            {statusesData.map((status) => (
                                                <SelectItem key={status.id} value={status.id.toString()}>
                                                    {capitalizeFirst(status.status)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedRole} onValueChange={(value) => {
                                        setSelectedRole(value);
                                        setPage(1);
                                    }}>
                                        <SelectTrigger className="w-[140px] md:w-[180px]">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All roles</SelectItem>
                                            {rolesData.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {capitalizeFirst(role.role)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button onClick={() => {
                                        setSelectedRole("all");
                                        setSelectedStatus("all");
                                        setPage(1);
                                    }} variant="outline" className="w-auto px-4 md:w-auto">
                                        Clear filters
                                    </Button>
                                </div>
                            </div>
                        </div>

                    }
                    columns={getUsersColumns(handleUserClick, isAdmin)}
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