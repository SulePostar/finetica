import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Partner.css';

const Partner = () => {
    const navigate = useNavigate();
    const sidebarWidth = useSidebarWidth();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [partnerToDelete, setPartnerToDelete] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const apiEndpoint = useMemo(() => `${API_BASE}/partners`, [API_BASE]);

    const handleView = useCallback(
        (id) => {
            navigate(`/partners/${id}`);
        },
        [navigate]
    );

    const handleEdit = useCallback(
        (id) => {
            navigate(`/partners/${id}/edit`);
        },
        [navigate]
    );

    const handleDelete = useCallback((id) => {
        setPartnerToDelete(id);
        setDeleteModalVisible(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!partnerToDelete) return;

        try {
            const response = await fetch(`${apiEndpoint}/${partnerToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete partner');
            }

            console.log('Successfully deleted partner:', partnerToDelete);
        } catch (error) {
            console.error('Error deleting partner:', error);
        } finally {
            setDeleteModalVisible(false);
            setPartnerToDelete(null);
        }
    }, [partnerToDelete, apiEndpoint]);

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Type',
            selector: (row) => row.type,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            wrap: true,
            width: '200px',
        },
        {
            name: 'Short Name',
            selector: (row) => row.shortName,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Country Code',
            selector: (row) => row.countryCode,
            sortable: true,
            width: '150px',
        },
        {
            name: 'VAT Number',
            selector: (row) => row.vatNumber,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Tax ID',
            selector: (row) => row.taxId,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Registration No.',
            selector: (row) => row.registrationNumber,
            sortable: true,
            width: '200px',
        },
        {
            name: 'VAT Registered',
            selector: (row) => row.is_vat_registered,
            sortable: true,
            width: '160px',
            cell: (row) => (
                <span className={`status-badge ${row.is_vat_registered ? 'active' : 'inactive'}`}>
                    {row.is_vat_registered ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            name: 'Address',
            selector: (row) => row.address,
            sortable: true,
            wrap: true,
            width: '250px',
        },
        {
            name: 'City',
            selector: (row) => row.city,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Postal Code',
            selector: (row) => row.postalCode,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            width: '220px',
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            sortable: true,
            width: '180px',
        },
        {
            name: 'IBAN',
            selector: (row) => row.iban,
            sortable: true,
            width: '250px',
        },
        {
            name: 'Bank Name',
            selector: (row) => row.bankName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'SWIFT Code',
            selector: (row) => row.swiftCode,
            sortable: true,
            width: '160px',
        },
        {
            name: 'Default Currency',
            selector: (row) => row.defaultCurrency,
            sortable: true,
            width: '160px',
        },
        {
            name: 'Language Code',
            selector: (row) => row.languageCode,
            sortable: true,
            width: '160px',
        },
        {
            name: 'Payment Terms',
            selector: (row) => row.paymentTerms,
            sortable: true,
            wrap: true,
            width: '200px',
        },
        {
            name: 'Status',
            selector: (row) => row.isActive,
            sortable: true,
            width: '120px',
            cell: (row) => (
                <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            name: 'Note',
            selector: (row) => row.note,
            sortable: true,
            wrap: true,
            width: '200px',
        },
        {
            name: 'Created At',
            selector: (row) => row.createdAt,
            sortable: true,
            width: '160px',
            cell: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString() : ''),
        },
        {
            name: 'Updated At',
            selector: (row) => row.updatedAt,
            sortable: true,
            width: '160px',
            cell: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''),
        },
        {
            name: 'Actions',
            width: '140px',
            cell: (row) => (
                <ActionsDropdown
                    row={row}
                    onView={() => handleView(row.id)}
                    onEdit={() => handleEdit(row.id)}
                    onDelete={() => handleDelete(row.id)}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    return (
        <DefaultLayout>
            <div
                className="table-page-outer partner-table-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <div className="partner-table-responsive">
                    <DynamicTable title="Partners" columns={columns} apiEndpoint={apiEndpoint} />
                </div>
            </div>

            <CModal
                alignment="center"
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Confirm Deletion</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete partner with ID: {partnerToDelete}? This action cannot be undone.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="danger" onClick={confirmDelete}>
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </DefaultLayout>
    );
};

export default Partner;
