import React, { useState } from 'react';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';
import {
    CCard,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CForm,
    CFormInput,
    CBadge,
} from '@coreui/react';
import AppButton from '../AppButton/AppButton';
import ConfirmationModal from '../Modals/ConfirmationModal/ConfirmationModal';
import './RolesStatusesTable.css';

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
    const [newValue, setNewValue] = useState('');
    const [confirmModal, setConfirmModal] = useState({ visible: false, item: null });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newValue.trim()) {
            onAdd({ [nameKey]: newValue });
            setNewValue('');
        }
    };

    const handleDeleteClick = (item) => {
        if (item[nameKey]?.toLowerCase() === 'admin') return;
        setConfirmModal({ visible: true, item });
    };

    const handleConfirmDelete = () => {
        if (confirmModal.item && confirmModal.item[nameKey]?.toLowerCase() !== 'admin') {
            onDelete(confirmModal.item.id);
        }
        setConfirmModal({ visible: false, item: null });
    };

    const handleCancelDelete = () => {
        setConfirmModal({ visible: false, item: null });
    };

    return (
        <CCard className="management-card shadow-sm">
            <div className="management-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 management-title">{title}</h5>
            </div>
            <CCardBody>
                <CTable hover responsive className="modern-table">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>{title}</CTableHeaderCell>
                            <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.length > 0 ? (
                            data.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.id}</CTableDataCell>
                                    <CTableDataCell>
                                        {title.toLowerCase().includes('status') ? (
                                            <CBadge
                                                color={
                                                    item[nameKey].toLowerCase() === 'approved'
                                                        ? 'success'
                                                        : item[nameKey].toLowerCase() === 'pending'
                                                            ? 'warning'
                                                            : item[nameKey].toLowerCase() === 'rejected'
                                                                ? 'danger'
                                                                : 'secondary'
                                                }
                                                className="status-badge"
                                            >
                                                {capitalizeFirst(item[nameKey])}
                                            </CBadge>
                                        ) : (
                                            <strong>{capitalizeFirst(item[nameKey])}</strong>
                                        )}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        <AppButton
                                            variant="danger"
                                            size="sm"
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(item)}
                                            disabled={item[nameKey]?.toLowerCase() === 'admin'}
                                            title={item[nameKey]?.toLowerCase() === 'admin' ? 'Cannot delete admin' : ''}
                                        >
                                            Delete
                                        </AppButton>

                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan={3} className="text-center text-muted">
                                    No {title.toLowerCase()} found
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
                <CForm onSubmit={handleSubmit} className="d-flex gap-2">
                    <CFormInput
                        size="sm"
                        className="add-input"
                        placeholder={`Add ${capitalizeFirst(title)}`}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <AppButton type="submit" size="sm" variant="primary">
                        Add
                    </AppButton>
                </CForm>
            </CCardBody>
            {/* Confirmation Modal for Delete */}
            <ConfirmationModal
                visible={confirmModal.visible}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={`Delete ${title}`}
                body={
                    confirmModal.item
                        ? `Are you sure you want to delete the ${title.toLowerCase().includes('status') ? 'status' : 'role'} "${confirmModal.item[nameKey]}"?`
                        : ''
                }
                confirmText="Delete"
                confirmColor="danger"
            />
        </CCard>
    );
};

export default RolesStatusesTable;
