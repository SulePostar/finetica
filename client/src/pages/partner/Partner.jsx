import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Partner.css';

const Partner = () => {
    const navigate = useNavigate();
    const sidebarWidth = useSidebarWidth();

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const apiEndpoint = useMemo(() => `${API_BASE}/partners`, [API_BASE]);

    const handleView = useCallback(
        (id) => {
            navigate(`/partners/${id}`);
        },
        [navigate]
    );

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
        selector: (row) => row.short_name,
        sortable: true,
        width: '180px',
    },
    {
        name: 'Country Code',
        selector: (row) => row.country_code,
        sortable: true,
        width: '150px',
    },
    {
        name: 'VAT Number',
        selector: (row) => row.vat_number,
        sortable: true,
        width: '180px',
    },
    {
        name: 'Tax ID',
        selector: (row) => row.tax_id,
        sortable: true,
        width: '180px',
    },
    {
        name: 'Registration No.',
        selector: (row) => row.registration_number,
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
        selector: (row) => row.postal_code,
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
        selector: (row) => row.bank_name,
        sortable: true,
        width: '200px',
    },
    {
        name: 'SWIFT Code',
        selector: (row) => row.swift_code,
        sortable: true,
        width: '160px',
    },
    {
        name: 'Default Currency',
        selector: (row) => row.default_currency,
        sortable: true,
        width: '160px',
    },
    {
        name: 'Language Code',
        selector: (row) => row.language_code,
        sortable: true,
        width: '160px',
    },
    {
        name: 'Payment Terms',
        selector: (row) => row.payment_terms,
        sortable: true,
        wrap: true,
        width: '200px',
    },
    {
        name: 'Status',
        selector: (row) => row.is_active,
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
        selector: (row) => row.created_at,
        sortable: true,
        width: '160px',
        cell: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString() : ''),
    },
    {
        name: 'Updated At',
        selector: (row) => row.updated_at,
        sortable: true,
        width: '160px',
        cell: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleDateString() : ''),
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
                    <DynamicTable title="Partners" columns={columns} data={[]} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Partner;
