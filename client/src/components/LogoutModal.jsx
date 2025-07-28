import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton
} from '@coreui/react';

const LogoutModal = ({ visible, onCancel, onConfirm }) => {
    return (
        <CModal
            visible={visible}
            onClose={onCancel}
            alignment="center"
            className="modal-blur-overlay"
        >
            <CModalHeader closeButton>Confirm Logout</CModalHeader>
            <CModalBody>Are you sure you want to log out?</CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onCancel}>
                    Cancel
                </CButton>
                <CButton color="danger" onClick={onConfirm}>
                    Logout
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default LogoutModal;
