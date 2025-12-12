import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/queries/userQueries";
import { getUsersColumns } from "@/components/tables/columns/UsersColumns";
import { Spinner } from "@/components/ui/spinner";
import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function Users() {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data: users = [], isPending, isError, error, refetch } = useUsers();
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
                    title="Failed to load Bank Transactions"
                    showDetails={true}
                />
            </div>
        );
    }
    const total = users?.total ?? 0;

    return (
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

                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[140px] md:w-[180px]">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" className="w-auto px-4 md:w-auto">
                                    Clear filters
                                </Button>

                            </div>

                        </div>
                    </div>

                }
                columns={getUsersColumns()}
                data={users}
                total={total}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </div>
    );
}
