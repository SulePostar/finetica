import React from 'react';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import { useNavigate } from 'react-router-dom';
import './Contract.css';

const Contract = () => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/contract/${id}`);
    };

    const handleEdit = (id) => { };
    const handleDelete = (id) => { };
    const handleDownload = (id) => { };

    const columns = [
        { 
            name: 'Partner ID',
            selector: row => row.partner_id,
            sortable: true 
        },
        { 
            name: 'Contract Number',
            selector: row => row.contract_number,
            sortable: true 
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
            wrap: true 
        },
        { 
            name: 'Start Date',
            selector: row => row.start_date,
            sortable: true 
        },
        { 
            name: 'End Date',
            selector: row => row.end_date,
            sortable: true 
        },
        { 
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
            cell: row => (
                <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { 
            name: 'Payment Terms',
            selector: row => row.payment_terms,
            sortable: true 
        },
        { 
            name: 'Currency',
            selector: row => row.currency,
            sortable: true 
        },
        { 
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            right: true 
        },
        { 
            name: 'Signed At',
            selector: row => row.signed_at,
            sortable: true 
        },
        {
            name: 'Actions',
            cell: row => (
                <ActionsDropdown
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 mt-5">
                <div className="contract-table-wrapper pt-5">
                  <DynamicTable
                      title="Contracts"
                      columns={columns}
                      apiEndpoint="http://localhost:4000/api/contracts"
                  />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Contract;