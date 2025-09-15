import React, { useState, useEffect, useCallback } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CForm,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CSpinner,
    CAlert,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { cilSearch, cilCloudDownload, cilFilter, cilMagnifyingGlass } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { format } from 'date-fns';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import { activityLogService } from '../../services/activityLogService';
import '../../styles/TablePages.css';

const ActivityLogs = () => {
    const sidebarWidth = useSidebarWidth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 20,
    });

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        userId: '',
        action: '',
        entity: '',
        status: '',
        startDate: '',
        endDate: '',
    });

    // Sorting states
    const [sorting, setSorting] = useState({
        sortBy: 'created_at',
        sortOrder: 'DESC',
    });

    // Modal states
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    // Fetch logs with current filters and pagination
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                sortBy: sorting.sortBy,
                sortOrder: sorting.sortOrder,
                ...filters,
            };

            const response = await activityLogService.getActivityLogs(params);

            if (response.success) {
                setLogs(response.data);
                setPagination(response.pagination);
            } else {
                setError('Failed to fetch activity logs');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch activity logs');
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.limit, sorting, filters]);

    // Export logs to CSV
    const handleExport = async () => {
        try {
            const params = {
                ...filters,
                sortBy: sorting.sortBy,
                sortOrder: sorting.sortOrder,
            };

            const csvContent = await activityLogService.exportToCSV(params);

            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `activity-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export logs');
        }
    };

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    };

    // Handle sorting changes
    const handleSort = (field) => {
        setSorting(prev => ({
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        }));
    };

    // Handle page change
    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    // Show log details modal
    const showLogDetails = (log) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: '',
            userId: '',
            action: '',
            entity: '',
            status: '',
            startDate: '',
            endDate: '',
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Apply filters
    const applyFilters = () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Fetch logs when dependencies change
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'success':
                return 'success';
            case 'failure':
                return 'danger';
            case 'pending':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    // Get action badge color
    const getActionBadgeColor = (action) => {
        const actionColors = {
            login: 'info',
            logout: 'secondary',
            register: 'success',
            create: 'success',
            update: 'warning',
            delete: 'danger',
            view: 'primary',
            export: 'info',
            import: 'warning',
        };
        return actionColors[action] || 'secondary';
    };

    return (
        <DefaultLayout>
            <div
                className="table-page-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <div className="table-content-wrapper">
                    <CRow>
                        <CCol xs={12}>
                            <CCard className="mb-4">
                                <CCardHeader>
                                    <CRow className="align-items-center">
                                        <CCol>
                                            <h4 className="mb-0">Activity Logs</h4>
                                            <small className="text-muted">
                                                Monitor and audit user activities across the system
                                            </small>
                                        </CCol>
                                        <CCol xs="auto">
                                            <CButton
                                                color="success"
                                                onClick={handleExport}
                                                disabled={loading}
                                            >
                                                <CIcon icon={cilCloudDownload} className="me-2" />
                                                Export CSV
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    {/* Filters */}
                                    <CCard className="mb-4">
                                        <CCardBody>
                                            <CRow>
                                                <CCol md={3}>
                                                    <CFormLabel>Search</CFormLabel>
                                                    <CInputGroup>
                                                        <CInputGroupText>
                                                            <CIcon icon={cilSearch} />
                                                        </CInputGroupText>
                                                        <CFormInput
                                                            placeholder="Search actions, entities, details..."
                                                            value={filters.search}
                                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                                        />
                                                    </CInputGroup>
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormLabel>Action</CFormLabel>
                                                    <CFormSelect
                                                        value={filters.action}
                                                        onChange={(e) => handleFilterChange('action', e.target.value)}
                                                    >
                                                        <option value="">All Actions</option>
                                                        <option value="login">Login</option>
                                                        <option value="logout">Logout</option>
                                                        <option value="register">Register</option>
                                                        <option value="create">Create</option>
                                                        <option value="update">Update</option>
                                                        <option value="delete">Delete</option>
                                                        <option value="view">View</option>
                                                        <option value="export">Export</option>
                                                        <option value="import">Import</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormLabel>Entity</CFormLabel>
                                                    <CFormSelect
                                                        value={filters.entity}
                                                        onChange={(e) => handleFilterChange('entity', e.target.value)}
                                                    >
                                                        <option value="">All Entities</option>
                                                        <option value="User">User</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Invoice">Invoice</option>
                                                        <option value="BusinessPartner">Business Partner</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormLabel>Status</CFormLabel>
                                                    <CFormSelect
                                                        value={filters.status}
                                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                                    >
                                                        <option value="">All Statuses</option>
                                                        <option value="success">Success</option>
                                                        <option value="failure">Failure</option>
                                                        <option value="pending">Pending</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormLabel>Date Range</CFormLabel>
                                                    <CRow>
                                                        <CCol xs={6}>
                                                            <CFormInput
                                                                type="date"
                                                                value={filters.startDate}
                                                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                                                placeholder="Start Date"
                                                            />
                                                        </CCol>
                                                        <CCol xs={6}>
                                                            <CFormInput
                                                                type="date"
                                                                value={filters.endDate}
                                                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                                                placeholder="End Date"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                </CCol>
                                            </CRow>
                                            <CRow className="mt-3">
                                                <CCol>
                                                    <CButton
                                                        color="primary"
                                                        onClick={applyFilters}
                                                        disabled={loading}
                                                        className="me-2"
                                                    >
                                                        <CIcon icon={cilFilter} className="me-2" />
                                                        Apply Filters
                                                    </CButton>
                                                    <CButton
                                                        color="secondary"
                                                        variant="outline"
                                                        onClick={clearFilters}
                                                        disabled={loading}
                                                    >
                                                        Clear Filters
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </CCard>

                                    {/* Error Alert */}
                                    {error && (
                                        <CAlert color="danger" dismissible onClose={() => setError(null)}>
                                            {error}
                                        </CAlert>
                                    )}

                                    {/* Logs Table */}
                                    <CCard>
                                        <CCardBody>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <CSpinner />
                                                    <p className="mt-2">Loading activity logs...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <CTable hover responsive>
                                                        <CTableHead>
                                                            <CTableRow>
                                                                <CTableHeaderCell
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleSort('id')}
                                                                >
                                                                    ID
                                                                    {sorting.sortBy === 'id' && (
                                                                        <span className="ms-1">
                                                                            {sorting.sortOrder === 'ASC' ? '↑' : '↓'}
                                                                        </span>
                                                                    )}
                                                                </CTableHeaderCell>
                                                                <CTableHeaderCell>User</CTableHeaderCell>
                                                                <CTableHeaderCell
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleSort('action')}
                                                                >
                                                                    Action
                                                                    {sorting.sortBy === 'action' && (
                                                                        <span className="ms-1">
                                                                            {sorting.sortOrder === 'ASC' ? '↑' : '↓'}
                                                                        </span>
                                                                    )}
                                                                </CTableHeaderCell>
                                                                <CTableHeaderCell>Entity</CTableHeaderCell>
                                                                <CTableHeaderCell>Status</CTableHeaderCell>
                                                                <CTableHeaderCell
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleSort('created_at')}
                                                                >
                                                                    Timestamp
                                                                    {sorting.sortBy === 'created_at' && (
                                                                        <span className="ms-1">
                                                                            {sorting.sortOrder === 'ASC' ? '↑' : '↓'}
                                                                        </span>
                                                                    )}
                                                                </CTableHeaderCell>
                                                                <CTableHeaderCell>Actions</CTableHeaderCell>
                                                            </CTableRow>
                                                        </CTableHead>
                                                        <CTableBody>
                                                            {logs.map((log) => (
                                                                <CTableRow key={log.id}>
                                                                    <CTableDataCell>{log.id}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        <div>
                                                                            <strong>
                                                                                {log.user?.firstName} {log.user?.lastName}
                                                                            </strong>
                                                                            <br />
                                                                            <small className="text-muted">
                                                                                {log.user?.email}
                                                                            </small>
                                                                        </div>
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        <CBadge color={getActionBadgeColor(log.action)}>
                                                                            {log.action}
                                                                        </CBadge>
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {log.entity && (
                                                                            <CBadge color="info">
                                                                                {log.entity}
                                                                            </CBadge>
                                                                        )}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        <CBadge color={getStatusBadgeColor(log.status)}>
                                                                            {log.status}
                                                                        </CBadge>
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        <small>
                                                                            {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                                                                        </small>
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        <CButton
                                                                            color="primary"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => showLogDetails(log)}
                                                                        >
                                                                            <CIcon icon={cilMagnifyingGlass} />
                                                                        </CButton>
                                                                    </CTableDataCell>
                                                                </CTableRow>
                                                            ))}
                                                        </CTableBody>
                                                    </CTable>

                                                    {/* Pagination */}
                                                    {pagination.totalPages > 1 && (
                                                        <CPagination className="mt-3 justify-content-center">
                                                            <CPaginationItem
                                                                disabled={!pagination.hasPrevPage}
                                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                            >
                                                                Previous
                                                            </CPaginationItem>

                                                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                                                <CPaginationItem
                                                                    key={page}
                                                                    active={page === pagination.currentPage}
                                                                    onClick={() => handlePageChange(page)}
                                                                >
                                                                    {page}
                                                                </CPaginationItem>
                                                            ))}

                                                            <CPaginationItem
                                                                disabled={!pagination.hasNextPage}
                                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                            >
                                                                Next
                                                            </CPaginationItem>
                                                        </CPagination>
                                                    )}

                                                    {/* Results Info */}
                                                    <div className="text-center text-muted mt-3">
                                                        Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                                                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                                                        {pagination.totalCount} results
                                                    </div>
                                                </>
                                            )}
                                        </CCardBody>
                                    </CCard>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
            </div>

            {/* Log Details Modal */}
            <CModal
                visible={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                size="lg"
            >
                <CModalHeader onClose={() => setShowDetailsModal(false)}>
                    <CModalTitle>Activity Log Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedLog && (
                        <CRow>
                            <CCol md={6}>
                                <h6>Basic Information</h6>
                                <p><strong>ID:</strong> {selectedLog.id}</p>
                                <p><strong>Action:</strong> {selectedLog.action}</p>
                                <p><strong>Entity:</strong> {selectedLog.entity || 'N/A'}</p>
                                <p><strong>Entity ID:</strong> {selectedLog.entityId || 'N/A'}</p>
                                <p><strong>Status:</strong> {selectedLog.status}</p>
                                <p><strong>Timestamp:</strong> {format(new Date(selectedLog.createdAt), 'MMM dd, yyyy HH:mm:ss')}</p>
                            </CCol>
                            <CCol md={6}>
                                <h6>User Information</h6>
                                <p><strong>Name:</strong> {selectedLog.user?.firstName} {selectedLog.user?.lastName}</p>
                                <p><strong>Email:</strong> {selectedLog.user?.email}</p>
                                <p><strong>User ID:</strong> {selectedLog.userId}</p>
                            </CCol>
                            <CCol xs={12} className="mt-3">
                                <h6>Client Information</h6>
                                <p><strong>IP Address:</strong> {selectedLog.ipAddress || 'N/A'}</p>
                                <p><strong>User Agent:</strong> {selectedLog.userAgent || 'N/A'}</p>
                            </CCol>
                            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                <CCol xs={12} className="mt-3">
                                    <h6>Additional Details</h6>
                                    <pre className="bg-light p-3 rounded">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </CCol>
                            )}
                        </CRow>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        onClick={() => setShowDetailsModal(false)}
                    >
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </DefaultLayout>
    );
};

export default ActivityLogs;
