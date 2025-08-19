import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import { useNavigate } from 'react-router-dom';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import './Contract.css';
import { useCallback, useMemo } from 'react';

const Contract = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const apiEndpoint = useMemo(() => `${API_BASE}/contracts`, [API_BASE]);

  const handleView = useCallback((id) => {
    navigate(`/contracts/${id}`);
  }, [navigate]);

  const handleApprove = useCallback((id) => {
    navigate(`/contracts/${id}/approve`);
  }, [navigate]);

  const handleDownload = useCallback((id) => {
    // TODO: implement download kada backend ruta bude spremna
  }, []);

  const handleRowClick = useCallback((row) => {
    navigate(`/contracts/${row.id}`);
  }, [navigate]);

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
      width: '200px',
    },
    {
      name: 'Type',
      selector: row => row.contract_type,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
      width: '200px',
    },
    {
      name: 'Start Date',
      selector: row => row.start_date,
      sortable: true,
      width: '150px',
      cell: row => row.start_date ? new Date(row.start_date).toLocaleDateString() : '',
    },
    {
      name: 'End Date',
      selector: row => row.end_date,
      sortable: true,
      width: '145px',
      cell: row => row.end_date ? new Date(row.end_date).toLocaleDateString() : '',
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
      width: '120px',
    },
    {
      name: 'Payment Terms',
      selector: row => row.payment_terms,
      sortable: true,
      width: '190px',
    },
    {
      name: 'Currency',
      selector: row => row.currency,
      sortable: true,
      width: '135px',
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      width: '140px',
      style: { textAlign: 'right' },
    },
    {
      name: 'Signed At',
      selector: row => row.signed_at,
      sortable: true,
      width: '150px',
      cell: row => row.signed_at ? new Date(row.signed_at).toLocaleDateString() : '',
    },
    {
      name: 'Review Status',
      selector: row => row.status,
      sortable: true,
      width: '190px',
      cell: row => (row.status ? row.status : '—'),
    },
    {
      name: 'Actions',
      width: '140px',
      cell: row => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onApprove={() => handleApprove(row.id)}   // ⬅️ samo navigate
          onDownload={handleDownload}
          // Approved stanje isključivo iz baze (nema localStorage)
          isApproved={Boolean(row.approved_at || row.approved_by || row.status === 'approved')}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer contract-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="contract-table-responsive">
          <DynamicTable
            title="Contracts"
            columns={columns}
            apiEndpoint={apiEndpoint}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Contract;
