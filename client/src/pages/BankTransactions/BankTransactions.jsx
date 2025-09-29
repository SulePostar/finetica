import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import BankTransactionsService from '../../services/bankTransactions';
import './BankTransactions.css';

const BankTransactions = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(
    () => `${API_BASE}/bank-transactions`,
    [API_BASE]
  );

  const [refetchFunction, setRefetchFunction] = useState(null);
  const handleRefetchCallback = useCallback((fn) => setRefetchFunction(() => fn), []);

  const handleView = useCallback((id) => navigate(`/bank-transactions/${id}`), [navigate]);
  const handleApprove = useCallback((id) => navigate(`/bank-transactions/${id}/approve`), [navigate]);

  const handleDownload = useCallback(async (id) => {
    try {
      const { data } = await BankTransactionsService.getById(id);
      if (!data?.pdfUrl) return;
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `bank-transaction-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download failed:', e);
    }
  }, []);

  const columns = [
    {
      name: 'Date',
      selector: (row) => row.date || '—',
      sortable: true,
      cell: (row) => (row.date ? new Date(row.date).toLocaleDateString() : '—')
    },
    {
      name: 'Category',
      selector: (row) => row.TransactionCategory?.name || '—',
      sortable: true,
      cell: (row) => row.TransactionCategory?.name || '—',
    },
    { name: 'Account Number', selector: (row) => row.accountNumber || '—', sortable: true, width: '200px' },
    { name: 'Description', selector: (row) => row.description || '—', sortable: true, wrap: true, width: '300px' },
    {
      name: 'Amount',
      selector: (row) => (row.amount != null ? row.amount : '—'),
      sortable: true,
      cell: (row) => (row.amount != null ? `${parseFloat(row.amount).toFixed(2)} KM` : '—'),
      style: { textAlign: 'right' },
      width: '160px',
    },
    {
      name: 'Status',
      selector: (row) => (row.approvedAt || row.approvedBy ? 'Approved' : 'Pending'),
      sortable: true,
      width: '130px',
      cell: (row) => {
        const status = row.approvedAt || row.approvedBy ? 'approved' : 'pending';
        return <span className={`status-badge ${status}`}>{status === 'approved' ? 'Approved' : 'Pending'}</span>;
      },
    },
    {
      name: 'Actions',
      cell: (row) => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onApprove={() => handleApprove(row.id)}
          onDownload={() => handleDownload(row.id)}
          isApproved={Boolean(row.approvedAt || row.approvedBy)}
        />
      ),
      ignoreRowClick: true,
      width: '140px',
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
        <div className="bank-transactions-table-scroll bank-transactions-table-responsive">
          <DynamicTable
            title="Bank Statements"
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

export default BankTransactions;
