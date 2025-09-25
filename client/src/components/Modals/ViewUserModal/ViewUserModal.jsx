import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CBadge,
} from '@coreui/react';
import { getRoleName, getStatusBadge } from '../../../utilis/formatters';
import { formatDateTime } from '../../../helpers/formatDate';
import AppButton from '../../AppButton/AppButton';
import './ViewUserModal.css';

const ViewUserModal = ({ visible, onClose, user, onEdit, onDelete, roles, statuses, isDarkMode }) => {
    if (!user) return null;

    return (
        <CModal
            visible={visible}
            onClose={onClose}
            size="lg"
            alignment="center"
        >
            <CModalHeader className="position-relative">
                <div className="row w-100 align-items-center">
                    {/* Left Column: Avatar + Name */}
                    <div className="col d-flex align-items-center gap-3">
                        <div className="avatar-circle-view-model d-flex align-items-center justify-content-center rounded-circle fw-semibold text-white">
                            {user.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <CModalTitle className='mb-0 fw-semibold'>
                                    {user.fullName}
                                </CModalTitle>
                                <div className="status-badge">
                                    {getStatusBadge(user.statusId, statuses)}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buttons side by side */}
                    <div className="button-group col d-flex gap-2 mt-2 mb-2 me-2">
                        <AppButton variant="edit" onClick={() => onEdit(user)}>Edit</AppButton>
                        <AppButton variant="danger" onClick={() => onDelete(user)}>Delete</AppButton>
                    </div>
                </div>
            </CModalHeader>

            <CModalBody>
                <div className="row">
                    {/* Left Column - Contact Information */}
                    <div className="col-md-6">
                        <CBadge className='fs-6 text-header'>
                            Contact Information
                        </CBadge>
                        <div className='small mb-1'>Email</div>

                        <AppButton
                            className="p-0 text-email"
                            variant="none"
                            onClick={() => window.location = `mailto:${user.email}`}
                        >
                            {user.email}
                        </AppButton>

                    </div>

                    {/* Right Column - Account Details */}
                    <div className="col-md-6">
                        <CBadge className='fs-6 text-header'>
                            Account Details
                        </CBadge>
                        <div className={`small mb-1 ${isDarkMode ? 'text-light' : 'text-muted'}`}>Last Active</div>
                        <div className={isDarkMode ? 'text-light' : ''}>
                            {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"}
                        </div>
                    </div>
                </div>

                {/* Role Information */}
                <div className="row mt-4">
                    <div className="col-12">
                        <CBadge className='fs-6 text-header'>
                            Role Information
                        </CBadge>
                        <div className="d-flex align-items-center mt-1">
                            <CBadge className="role-badge">
                                {getRoleName(user, roles)}
                            </CBadge>
                        </div>
                    </div>
                </div>
            </CModalBody>

            <CModalFooter>
                <AppButton variant="no-hover" onClick={onClose}>Close</AppButton>
            </CModalFooter>
        </CModal>
    );
};

export default ViewUserModal;