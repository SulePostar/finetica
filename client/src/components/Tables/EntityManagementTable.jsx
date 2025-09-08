import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CSpinner,
    CBadge,
    CContainer,
    CRow,
    CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilPencil, cilCheck, cilX } from '@coreui/icons';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';
import ConfirmationModal from '../Modals/ConfirmationModal';
import notify from '../../utilis/toastHelper';
import './EntityManagementTable.css';


const EntityManagementTable = ({
    title,
    data,
    nameKey,
    onAdd,
    onDelete,
    loading = false,
    error = null,
    success = null,
    onClearError = null,
    onClearSuccess = null
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newValue, setNewValue] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle error and success messages with toast notifications
    useEffect(() => {
        if (error) {
            notify.onError(error);
            if (onClearError) onClearError();
        }
    }, [error, onClearError]);

    useEffect(() => {
        if (success) {
            notify.onSuccess(success);
            if (onClearSuccess) onClearSuccess();
        }
    }, [success, onClearSuccess]);

    const handleAdd = async () => {
        if (newValue.trim()) {
            setIsSubmitting(true);
            try {
                await onAdd({ [nameKey]: newValue.trim() });
                setNewValue('');
                setShowAddModal(false);
            } catch (error) {
                console.error('Error adding item:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            setIsSubmitting(true);
            try {
                await onDelete(itemToDelete.id);
                setShowDeleteModal(false);
                setItemToDelete(null);
            } catch (error) {
                console.error('Error deleting item:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleCloseAddModal = () => {
        setNewValue('');
        setShowAddModal(false);
    };

    const handleCloseDeleteModal = () => {
        setItemToDelete(null);
        setShowDeleteModal(false);
    };

    const getEntityName = (singular = false) => {
        const baseName = title.toLowerCase();
        return singular ? baseName.slice(0, -1) : baseName;
    };

    const getEntityCount = () => {
        return Array.isArray(data) ? data.filter(item => item && item.id).length : 0;
    };

    return (
        <CCard className="h-100 entity-management-card">
            <CCardHeader className="entity-management-header border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 text-primary fw-bold">{title}</h5>
                        <p className="text-muted small mb-0">
                            <span className="entity-count-badge">
                                {getEntityCount()}
                            </span> {getEntityName()} total
                        </p>
                    </div>
                    <CButton
                        color="primary"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                        className="d-flex align-items-center entity-action-button"
                    >
                        <CIcon icon={cilPlus} className="me-1" />
                        Add {getEntityName(true)}
                    </CButton>
                </div>
            </CCardHeader>

            <CCardBody className="pt-3">
                {/* Table */}
                <div className="table-responsive">
                    <CTable hover striped className="mb-0 entity-table">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>
                                    ID
                                </CTableHeaderCell>
                                <CTableHeaderCell>
                                    {capitalizeFirst(nameKey)}
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={{ width: '120px' }}>
                                    Actions
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                <CTableRow>
                                    <CTableDataCell colSpan="3" className="loading-state">
                                        <CSpinner size="sm" className="me-2" />
                                        Loading {getEntityName()}...
                                    </CTableDataCell>
                                </CTableRow>
                            ) : Array.isArray(data) && data.filter(item => item && item.id).length > 0 ? (
                                data
                                    .filter(item => item && item.id)
                                    .map((item, index) => (
                                        <CTableRow key={item.id} className="align-middle">
                                            <CTableDataCell>
                                                <span className="entity-id-badge">
                                                    #{item.id}
                                                </span>
                                            </CTableDataCell>
                                            <CTableDataCell className="entity-name">
                                                {item[nameKey]}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton
                                                    color="danger"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="d-flex align-items-center mx-auto entity-action-button"
                                                >
                                                    <CIcon icon={cilTrash} className="me-1" />
                                                    Delete
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan="3" className="empty-state">
                                        <CIcon icon={cilPencil} className="empty-state-icon" />
                                        <div>No {getEntityName()} found.</div>
                                        <small>Add your first {getEntityName(true)}!</small>
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </div>
            </CCardBody>

            {/* Add Modal */}
            <CModal
                visible={showAddModal}
                onClose={handleCloseAddModal}
                alignment="center"
                backdrop="static"
                className="entity-modal"
            >
                <CModalHeader closeButton>
                    <CModalTitle className="d-flex align-items-center">
                        <CIcon icon={cilPlus} className="me-2" />
                        Add New {getEntityName(true)}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="entity-form-label">
                            {capitalizeFirst(nameKey)} Name
                        </label>
                        <CFormInput
                            type="text"
                            placeholder={`Enter ${nameKey} name`}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                            disabled={isSubmitting}
                            className="entity-form-input"
                            autoFocus
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="outline"
                        onClick={handleCloseAddModal}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </CButton>
                    <CButton
                        color="primary"
                        onClick={handleAdd}
                        disabled={!newValue.trim() || isSubmitting}
                        className="d-flex align-items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <CSpinner size="sm" className="me-2" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <CIcon icon={cilCheck} className="me-2" />
                                Add {getEntityName(true)}
                            </>
                        )}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                visible={showDeleteModal}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${getEntityName(true)}`}
                body={
                    <div>
                        <p className="mb-3">
                            Are you sure you want to delete this {getEntityName(true)}?
                        </p>
                        {itemToDelete && (
                            <div className="delete-item-preview">
                                <strong>{capitalizeFirst(nameKey)}:</strong> {itemToDelete[nameKey]}
                            </div>
                        )}
                        <div className="delete-warning">
                            <strong>Warning:</strong> This action cannot be undone.
                        </div>
                    </div>
                }
                cancelText="Cancel"
                confirmText={`Delete ${getEntityName(true)}`}
                confirmColor="danger"
                loading={isSubmitting}
            />
        </CCard>
    );
};

export default EntityManagementTable;
