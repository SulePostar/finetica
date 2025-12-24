import React, { useMemo, useState } from "react";
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
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import useDebounce from "@/hooks/use-debounce";
import DefaultLayout from "@/layout/DefaultLayout";

const Users = () => {
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 400);
    const navigate = useNavigate();

    const columns = useMemo(() => getUsersColumns(), []);

    const { data: response, isPending, isError, error, refetch, } = useUsers({
        page,
        perPage,
        roleId: selectedRole === "all" ? null : selectedRole,
        statusId: selectedStatus === "all" ? null : selectedStatus,
        search: debouncedSearch,
    });
    const { data: rolesResponse } = useRoles();
    const { data: statusesResponse } = useStatuses();
    const usersData = response?.data ?? [];
    const totalUsers = response?.total ?? 0;
    const rolesData = rolesResponse?.data ?? [];
    const statusesData = statusesResponse?.data || [];

    const handleUserClick = (user) => {
        navigate(`/profile/${user.id}`);
    };

    if (isError) {
        return (
            <div>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Users"
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
                                placeholder="Search by name or email"
                                className="w-full md:flex-1 min-w-[200px]"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />,
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
                                    setSearch("");
                                    setPage(1);
                                }}
                            >
                                Clear filters
                            </Button>
                        )
                    }}
                    columns={columns}
                    data={usersData}
                    total={totalUsers}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                    onRowClick={handleUserClick}
                    loading={isPending}
                />

                {isPending && (
                    <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-white/40">
                        <Spinner className="w-12 h-12 text-[var(--spurple)]" />
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Users;
