import React from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import { useNavigate } from 'react-router-dom';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import './Contract.css';

const Contract = () => {
    const navigate = useNavigate();
    const sidebarWidth = useSidebarWidth();

    const handleView = (id) => {
        navigate(`/contracts/${id}`);
    };

    const handleEdit = (id) => { };
    const handleDelete = (id) => { };
    const handleDownload = (id) => { };

    const handleRowClick = (row) => {
        console.log('Row clicked:', row);
        console.log('Navigating to:', `/contracts/${row.id}`);
        navigate(`/contracts/${row.id}`);
    };

    const columns = [
        {
            name: 'Partner ID',
            selector: row => row.partner_id,
            sortable: true,
            width: '140px',
        },
        {
            name: 'Contract Number',
            selector: row => row.contract_number,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Type',
            selector: row => row.contract_type,
            sortable: true
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Start Date',
            selector: row => row.start_date,
            sortable: true,
            width: '150px',
            cell: row => new Date(row.start_date).toLocaleDateString()
        },
        {
            name: 'End Date',
            selector: row => row.end_date,
            sortable: true,
            width: '145px',
            cell: row => new Date(row.end_date).toLocaleDateString()
        },
        {
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
            cell: row => (
                <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
            width: '120px'
        },
        {
            name: 'Payment Terms',
            selector: row => row.payment_terms,
            sortable: true,
            width: '190px'
        },
        {
            name: 'Currency',
            selector: row => row.currency,
            sortable: true,
            width: '135px'
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            width: '140px',
            style: { textAlign: 'right' }
        },
        {
            name: 'Signed At',
            selector: row => row.signed_at,
            sortable: true,
            width: '150px',
            cell: row => new Date(row.signed_at).toLocaleDateString()
        },
        {
            name: 'Actions',
            width: '120px',
            cell: row => (
                <ActionsDropdown
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                />
            ),
            ignoreRowClick: true
        }
    ];

    return (
        <DefaultLayout>
            <div
                className="table-page-outer contract-table-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                    padding: '5rem 5rem 2rem',
                }}
            >
                <div className="contract-table-responsive">
                    <DynamicTable
                        title="Contracts"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/contracts"
                        onRowClick={handleRowClick}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Contract;