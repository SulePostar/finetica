import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CBadge,
} from '@coreui/react';
import { getRoleName, getStatusBadge } from '../../../utilis/formatters';
import { formatDateTime } from '../../../helpers/formatDate';
import './ViewUserModal.css';

const ViewUserModal = ({ visible, onClose, user, onEdit, onDelete, roles, statuses }) => {
    if (!user) return null;

    return (
        <CModal visible={visible} onClose={onClose} size="lg" alignment="center" className="view-user-modal">
            <CModalHeader className="position-relative">
                <div className="row w-100 align-items-center">
                    {/* Left Column: Avatar + Name */}
                    <div className="col d-flex align-items-center gap-3">
                        <div className="avatar-circle-view-model d-flex align-items-center justify-content-center rounded-circle fw-semibold text-white">
                            {user.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <CModalTitle className="mb-0 fw-semibold">{user.fullName}</CModalTitle>
                                {getStatusBadge(user.statusId, statuses)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buttons side by side */}
                    <div className="col-auto d-flex gap-1 m-3">
                        <CButton className='btn-bordered' size="m" onClick={() => onEdit(user)}>
                            Edit
                        </CButton>
                        <CButton color="danger" size="m" onClick={() => onDelete(user)}>
                            Delete
                        </CButton>
                    </div>
                </div>
            </CModalHeader>


            <CModalBody>
                <div className="row">
                    {/* Left Column - Contact Information */}
                    <div className="col-md-6">
                        <CBadge className="fs-6 text-header mb-3 text-dark">
                            Contact Information
                        </CBadge>
                        <div className="small text-muted mb-1">Email</div>

                        <CButton
                            className="p-0 text-primary text-email"
                            onClick={() => window.location = `mailto:${user.email}`}
                        >
                            {user.email}
                        </CButton>
                    </div>


                    {/* Right Column - Account Details */}
                    <div className="col-md-6">
                        <CBadge className="fs-6 text-header mb-3 text-dark">
                            Account Details
                        </CBadge>
                        <div className="small text-muted mb-1">Last Active</div>
                        <div>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"}</div>
                    </div>
                </div>

                {/* Role Information */}
                <div className="row mt-4">
                    <div className="col-12">
                        {/* <h6 className="fw-semibold mb-3">Role Information</h6> */}
                        <CBadge className="fs-6 text-header mb-3 text-dark">
                            Role Information
                        </CBadge>
                        <div className="d-flex align-items-center gap-2">
                            <CBadge className="badge bg-light-gray text-dark">{getRoleName(user, roles)}</CBadge>
                        </div>
                    </div>
                </div>
            </CModalBody>

            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ViewUserModal;