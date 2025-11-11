import { CCardHeader } from '@coreui/react';
import AppButton from '../AppButton/AppButton';

export const DocumentActions = ({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete
}) => (
    <CCardHeader className="d-flex justify-content-center align-items-center border-none bg-transparent">
        <div className="d-flex gap-2">
            {isEditing ? (
                <>
                    <AppButton variant="primary" size="md" onClick={onSave}>Save</AppButton>
                    <AppButton variant="no-hover" size="md" onClick={onCancel}>Cancel</AppButton>
                </>
            ) : (
                <>
                    <AppButton variant="edit" size="md" onClick={onEdit} icon='mdi:pencil' iconClassName="me-1">
                        Edit
                    </AppButton>
                    <AppButton variant="danger" size="md" onClick={onDelete} icon='mdi:trash' iconClassName="me-1">
                        Delete
                    </AppButton>
                </>
            )}
        </div>
    </CCardHeader>
);