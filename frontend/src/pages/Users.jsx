import React, { useEffect, useState } from 'react';
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
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {notify} from "@/lib/notifications";
import { useAuth } from "@/context/AuthContext";


const Users = () => {
    const { user: currentUser, logout } = useAuth();
    const currentUserId = currentUser?.id;
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);
    const perPage = 10;

    const navigate = useNavigate();

    const { data: response, isPending, isError, error, refetch } = useUsers({
        page,
        perPage,
        roleId: selectedRole === "all" ? null : selectedRole,
        statusId: selectedStatus === "all" ? null : selectedStatus,
    });

    const { data: rolesResponse } = useRoles();
    const { data: statusesResponse } = useStatuses();

    const usersData = response?.data || [];
    const totalUsers = response?.total || 0;
    const rolesData = rolesResponse?.data || [];
    const statusesData = statusesResponse?.data || [];

    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    useEffect(() => {
      if (isError && error?.response?.status === 403) {
        notify.error("Access Restricted", {
          description: "You do not have permission to access this page.",
        });
        navigate('/dashboard');
      }
    }, [isError, error, navigate]);

    const handleUserClick = (user) => {
        navigate(`/profile/${user.id}`);
    };

    const handleUserAction = (actionKey, user) => {
        if (actionKey == "toggleStatus") {
            setSelectedUser(user);
            setIsDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;

        const isDeleting = selectedUser.isEnabled;
        const isDeletingSelf = selectedUser.id === currentUserId;

        updateUser(
            { id: selectedUser.id, isEnabled: !selectedUser.isEnabled },
            {
                onSuccess: () => {
                    if (isDeletingSelf && isDeleting) {
                        toast.success("Your account has been deactivated. Logging out...");
                        setTimeout(() => {
                            logout();
                            navigate("/login");
                        }, 1500);
                    } else {
                        toast.success(
                            isDeleting
                                ? "User deactivated successfully"
                                : "User restored successfully"
                        );
                        setIsDialogOpen(false);
                        setSelectedUser(null);
                        refetch();
                    }
                },
                onError: () => {
                    toast.error(
                        isDeleting
                            ? "Failed to deactivate user"
                            : "Failed to restore user"
                    );
                },
            }
        );
    };

    if (isPending) {
        return (
            <>
                <PageTitle text="User Management Dashboard" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-16 h-16 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <IsError
                error={error}
                onRetry={refetch}
                title="Failed to load users"
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
                        <Input placeholder="Search..." className="w-full" />
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
                                    {statusesData.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {capitalizeFirst(s.status)}
                                        </SelectItem>
                                    ))}
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
                                    {rolesData.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {capitalizeFirst(r.role)}
                                        </SelectItem>
                                    ))}
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
                    ),
                }}
                columns={getUsersColumns(handleUserAction, currentUserId)}
                data={usersData}
                total={totalUsers}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                onRowClick={handleUserClick}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser?.isEnabled ? "Deactivate" : "Activate"} user
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {selectedUser?.isEnabled ? "deactivate" : "activate"}{" "}
                            <span className="font-medium">
                                {selectedUser?.fullName}
                            </span>
                            ?<br />
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
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
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
