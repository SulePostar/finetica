import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import DynamicTable from "@/components/table/DynamicTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionsDropdown from "@/components/ActionsDropdown";
import { useUsers } from "@/queries/userQueries";
import { getUsersColumns } from "@/components/tables/columns/UsersColumns";
import { Spinner } from "@/components/ui/spinner";
import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";

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
                    <PageTitle
                        text="Bank Transactions"
                        subtitle="Overview of all bank transactions"
                        compact
                    />
                }
                columns={getUsersColumns()}
                data={users}
                total={total}
                page={page}
                perPage={perPage}
                onPageChange={setPage} />
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full">
                <Input
                    placeholder="Search..."
                    className="flex-1 min-w-[200px]"
                />

                <select className="w-[180px] border rounded-md px-2 py-2 text-sm bg-background">
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>

                <Button variant="outline">Clear filters</Button>
            </div>

            {/* Table Area */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            </div>
        </div>
    );
}
