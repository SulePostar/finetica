import { Button } from '@/components/ui/button';
import { Check, Save, X, Edit } from 'lucide-react';

const ActionButtons = ({
    isApproveMode = false,
    isEditMode = false,
    isEditing = false,
    isApproved = false,
    handleSave,
    handleCancel,
    handleApprove,
    handleEdit,
    isSaved = false,
}) => {
    // Approve mode logic
    if (isApproveMode) {
        // If already approved, show disabled Approved button
        if (isApproved) {
            return (
                <div className="w-full flex justify-center gap-2">
                    <Button variant="outline" disabled className="gap-2">
                        <Check className="h-4 w-4" />
                        Approved
                    </Button>
                </div>
            );
        }

        // If editing in approve mode, show Save + Cancel
        if (isEditing) {
            return (
                <div className="w-full flex justify-center gap-2">
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>
            );
        }

        return (
            <div className="w-full flex justify-center gap-2">
                <Button onClick={handleApprove} className="gap-2">
                    <Check className="h-4 w-4" />
                    Approve
                </Button>
                <Button variant="secondary" onClick={handleEdit} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
            </div>
        );
    }

    // Edit mode logic
    if (isEditMode) {
        if (isSaved) {
            return (
                <div className="w-full flex justify-center gap-2">
                    <Button variant="outline" disabled className="gap-2">
                        <Check className="h-4 w-4" />
                        Saved
                    </Button>
                </div>
            );
        }
        return (
            <div className="w-full flex justify-center gap-2">
                <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        );
    }

    return null;
};

export default ActionButtons;
