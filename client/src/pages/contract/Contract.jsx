import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Contract.css';

const Contract = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/contracts`, [API_BASE]);

  const handleView = useCallback((id) => {
    navigate(`/contracts/${id}`);
  }, [navigate]);

  const handleApprove = useCallback((id) => {
    navigate(`/contracts/${id}/approve`);
  }, [navigate]);

  const handleDownload = useCallback((id) => {
  }, []);

  const handleRowClick = useCallback((row) => {
    navigate(`/contracts/${row.id}`);
  }, [navigate]);

  const columns = [
    {
      name: 'Partner ID',
      selector: row => row.partnerId,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Contract Number',
      selector: row => row.contractNumber,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Type',
      selector: row => row.contractType,
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
      selector: row => row.startDate,
      sortable: true,
      width: '150px',
      cell: row => row.startDate ? new Date(row.startDate).toLocaleDateString() : '',
    },
    {
      name: 'End Date',
      selector: row => row.endDate,
      sortable: true,
      width: '145px',
      cell: row => row.endDate ? new Date(row.endDate).toLocaleDateString() : '',
    },
    {
      name: 'Status',
      selector: row => row.isActive,
      sortable: true,
      cell: row => (
        <span className={`status-badge ${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Payment Terms',
      selector: row => row.paymentTerms,
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
      selector: row => row.signedAt,
      sortable: true,
      width: '150px',
      cell: row => row.signedAt ? new Date(row.signedAt).toLocaleDateString() : '',
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
          onApprove={() => handleApprove(row.id)}
          onDownload={handleDownload}
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
