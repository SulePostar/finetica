import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';

const ConfirmationModal = ({
    visible,
    onCancel,
    onConfirm,
    title,
    body,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    confirmColor = 'primary',
}) => {
    return (
        <CModal
            visible={visible}
            onClose={onCancel}
            alignment="center"
            className="modal-blur-overlay"
        >
            <CModalHeader closeButton>{title}</CModalHeader>
            <CModalBody>{body}</CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onCancel}>
                    {cancelText}
                </CButton>
                <CButton color={confirmColor} onClick={onConfirm}>
                    {confirmText}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ConfirmationModal;
