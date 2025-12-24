import React, { useMemo, useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUsers } from "@/queries/userQueries";
import { useRoles } from "@/queries/rolesAndStatuses";
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
        search: debouncedSearch,
    });
    const { data: rolesResponse } = useRoles();

    const usersData = response?.data ?? [];
    const totalUsers = response?.total ?? 0;
    const rolesData = rolesResponse?.data ?? [];

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
                        <div className="flex flex-col gap-4 w-full">
                            <PageTitle
                                text="Users"
                                subtitle="Users management dashboard"
                                compact
                            />

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
                                <Input
                                    placeholder="Search by name or email"
                                    className="w-full md:flex-1 min-w-[200px]"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />

                                <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
                                    <Select
                                        value={selectedRole}
                                        onValueChange={(value) => {
                                            setSelectedRole(value);
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[140px] md:w-[180px]">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All roles</SelectItem>
                                            {rolesData.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.id.toString()}
                                                >
                                                    {capitalizeFirst(role.role)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedRole("all");
                                            setSearch("");
                                            setPage(1);
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
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
