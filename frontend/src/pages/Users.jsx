import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import useTableSearch from "@/hooks/use-table-search";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";

import { useUsers, useUpdateUser } from "@/queries/userQueries";
import { useRoles, useStatuses } from "@/queries/rolesAndStatuses";

import DynamicTable from "@/components/table/DynamicTable";
import { getUsersColumns } from "@/components/tables/columns/UsersColumns";

import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const Users = () => {
    const navigate = useNavigate();
    const { user: currentUser, logout } = useAuth();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { search, debouncedSearch, setSearch, clearSearch } = useTableSearch({
        delay: 400,
        setPage,
    });

    const { data: rolesResponse } = useRoles();
    const { data: statusesResponse } = useStatuses();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    const {
        data: response,
        isPending,
        isError,
        error,
        refetch,
    } = useUsers({
        page,
        perPage,
        roleId: selectedRole === "all" ? null : selectedRole,
        statusId: selectedStatus === "all" ? null : selectedStatus,
        search: debouncedSearch,
    });

    const currentUserId = currentUser?.id;
    const currentUserRole = currentUser?.roleName?.toLowerCase();
    const isAdmin = currentUserRole === 'admin';

    const rolesData = rolesResponse?.data || [];
    const statusesData = statusesResponse?.data || [];
    const usersData = response?.data || [];
    const totalUsers = response?.total || 0;


    const roleOptions = useMemo(() => {
        return (rolesResponse?.data ?? []).map((role) => (
            <SelectItem key={role.id} value={role.id.toString()}>
                {capitalizeFirst(role.role)}
            </SelectItem>
        ));
    }, [rolesResponse]);

    const statusOptions = useMemo(() => {
        return (statusesResponse?.data ?? []).map((status) => (
            <SelectItem key={status.id} value={status.id.toString()}>
                {capitalizeFirst(status.status)}
            </SelectItem>
        ));
    }, [statusesResponse]);

    const handleNavigate = (user) => {
        navigate(`/profile/${user.id}`);
    };

    const handleUserClick = (action, user) => {
        if (action === "view") {
            handleNavigate(user);
            return;
        }

        const statusMap = {
            Approve: { id: 2 },
            Reject: { id: 3 },
        };

        if (statusMap[action]) {
            updateUser({
                userId: user.id,
                payload: {
                    statusId: statusMap[action].id
                },
            }, {
                onSuccess: () => toast.success(`User ${action}ed successfully`),
                onError: () => toast.error(`Failed to ${action} user`)
            });
            return;
        }

        if (action === "toggleStatus") {
            setSelectedUser(user);
            setIsDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;

        const isDeactivating = selectedUser.isEnabled;
        const isSelf = selectedUser.id === currentUserId;

        updateUser(
            {
                userId: selectedUser.id,
                payload: { isEnabled: !selectedUser.isEnabled }
            },
            {
                onSuccess: () => {
                    if (isSelf && isDeactivating) { // Matches your variables
                        toast.success("Account deactivated. Logging out...");
                        setTimeout(() => {
                            logout();
                            navigate("/login");
                        }, 1500);
                    } else {
                        toast.success(isDeactivating ? "User deactivated" : "User restored");
                        setIsDialogOpen(false);
                        setSelectedUser(null);
                    }
                },
                onError: () => toast.error("Operation failed"),
            }
        );
    };

    const columns = useMemo(
        () => getUsersColumns(handleUserClick, currentUserId, isAdmin),
        [currentUserId, isAdmin]
    );

    if (isError) {
        return (
            <IsError
                error={error}
                onRetry={refetch}
                title="Failed to load Users"
                showDetails
            />
        );
    }
    return (
        <div className="pt-20">
            <DynamicTable
                header={
                    <PageTitle
                        text="Users"
                        subtitle="Users management dashboard"
                        compact
                    />
                }
                toolbar={{
                    search: (
                        <Input
                            placeholder="Search by name or email"
                            className="w-full md:flex-1 min-w-[200px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    ),
                    filters: (
                        <>
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => {
                                    setSelectedStatus(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {statusOptions}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedRole}
                                onValueChange={(value) => {
                                    setSelectedRole(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All roles</SelectItem>
                                    {roleOptions}
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
                                clearSearch();
                            }}
                        >
                            Clear filters
                        </Button>
                    ),
                }}
                columns={columns}
                data={usersData}
                total={totalUsers}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onRowClick={handleNavigate}
            />

            {isPending && (
                <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-white/40">
                    <Spinner className="w-12 h-12 text-[var(--spurple)]" />
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser?.isEnabled ? "Deactivate" : "Activate"} user
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {selectedUser?.isEnabled ? "deactivate" : "activate"}{" "}
                            <span className="font-medium">{selectedUser?.fullName}</span>?
                            <br />
                            {selectedUser?.id === currentUserId && selectedUser?.isEnabled ? (
                                <span className="text-destructive font-medium">
                                    You will be logged out immediately after deactivating your account.
                                </span>
                            ) : selectedUser?.isEnabled ? (
                                "This user will no longer be able to log in."
                            ) : (
                                "This user will be able to log in again."
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={selectedUser?.isEnabled ? "destructive" : "default"}
                            onClick={handleConfirmDelete}
                            disabled={isUpdating}
                        >
                            {selectedUser?.isEnabled ? "Deactivate" : "Activate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default Users;
