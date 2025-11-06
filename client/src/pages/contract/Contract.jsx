import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import './Contract.css';
import ContractsService from '../../services/contract';

const Contract = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();
  const bucketName = useBucketName();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/contracts`, [API_BASE]);
  const [refetchFunction, setRefetchFunction] = useState(null);

  const handleRefetchCallback = useCallback((fn) => setRefetchFunction(() => fn), []);

  const handleView = useCallback((id) => navigate(`/contracts/${id}`), [navigate]);
  const handleApprove = useCallback((id) => navigate(`/contracts/${id}/approve`), [navigate]);

  const handleDownload = useCallback(async (id) => {
    try {
      const { data } = await ContractsService.getById(id);
      if (!data?.pdfUrl) return;

      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `contract-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, []);

  const columns = [
    {
      name: 'Partner Name',
      selector: (row) => row.businessPartner?.name || '—',
      sortable: true,
      sortField: 'businessPartner.name',
      minWidth: '200px',
      maxWidth: '320px',
      wrap: true,
      cell: (row) => row.businessPartner?.name || '—',
    },
    {
      name: 'Number',
      selector: (row) => row.contractNumber || '—',
      sortable: true,
      sortField: 'contractNumber',
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Type',
      selector: (row) => row.contractType || '—',
      sortable: true,
      sortField: 'contractType',
      width: '250px',
      wrap: true,
      grow: 0,
      hideAtOrBelow: 'md',
      hideBelow: 1440,
    },
    {
      name: 'Start',
      selector: (row) => row.startDate || '—',
      sortable: true,
      sortField: 'startDate',
      minWidth: '130px',
      grow: 0,
      cell: (row) => (row.startDate ? new Date(row.startDate).toLocaleDateString() : '—'),
      hideAtOrBelow: 'lg',
      hideBelow: 1440,
    },
    {
      name: 'End',
      selector: (row) => row.endDate || '—',
      sortable: true,
      sortField: 'endDate',
      minWidth: '125px',
      grow: 0,
      cell: (row) => (row.endDate ? new Date(row.endDate).toLocaleDateString() : '—'),
      hideAtOrBelow: 'lg',
      hideBelow: 1024,
    },
    {
      name: 'Status',
      selector: (row) => row.isActive,
      sortable: true,
      sortField: 'isActive',
      minWidth: '90px',
      hideBelow: 1024,
      cell: (row) => (
        <span className={`status-badge ${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'Amount',
      selector: (row) => (row.amount != null ? row.amount : '—'),
      sortable: true,
      sortField: 'amount',
      minWidth: '130px',
      hideAtOrBelow: 'lg',
    },
    {
      name: 'Review',
      selector: (row) => row.status || '—',
      sortable: true,
      sortField: 'status',
      minWidth: '130px',
      wrap: true,
      cell: (row) => (
        <span className={`status-badge ${row.approvedAt ? 'approved' : 'pending'}`}>
          {row.approvedAt ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      name: 'Actions',
      minWidth: '100px',
      cell: (row) => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onApprove={() => handleApprove(row.id)}
          onDownload={() => handleDownload(row.id)}
          isApproved={Boolean(row.approvedAt || row.approvedBy || row.status === 'approved')}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer"
        style={{
          left: sidebarWidth + 24,
          right: 24,
        }}
      >
        <div className="contract-table-scroll contract-table-responsive">
          <DynamicTable
            title="Contracts"
            columns={columns}
            apiEndpoint={apiEndpoint}
            uploadButton={
              <UploadButton
                bucketName={bucketName}
                onUploadSuccess={() => {
                  if (refetchFunction) refetchFunction();
                }}
              />
            }
            onRefetch={handleRefetchCallback}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Contract;
