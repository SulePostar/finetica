import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";

const ApprovalModal = ({
                         isOpen,
                         onClose,
                         user,
                         roles,
                         selectedRole,
                         onRoleChange,
                         onConfirm,
                         isLoading,
                       }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve User</DialogTitle>
          <DialogDescription>
            Assign a role to <span className="font-medium">{user?.fullName}</span> before approving their account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Select Role *</Label>
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {capitalizeFirst(role.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !selectedRole}
          >
            Approve User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;