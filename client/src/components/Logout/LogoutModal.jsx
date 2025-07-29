import ConfirmationModal from './ConfirmationModal';

const LogoutModal = ({ visible, onCancel, onConfirm }) => {
    return (
        <ConfirmationModal
            visible={visible}
            onCancel={onCancel}
            onConfirm={onConfirm}
            title="Confirm Logout"
            body="Are you sure you want to log out?"
            cancelText="Cancel"
            confirmText="Logout"
            confirmColor="danger"
        />
    );
};

export default LogoutModal;
