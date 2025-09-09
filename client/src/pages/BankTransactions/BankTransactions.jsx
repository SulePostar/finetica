import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import '../../styles/shared/CommonStyles.css';
import '../../styles/TablePages.css';
import './BankTransactions.css';


const BankTransactions = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/transactions/bank-transaction-data`, [API_BASE]);

  const handleView = useCallback((id) => {
    navigate(`/bank-transactions/${id}`);
  }, [navigate]);

  const handleApprove = useCallback((id) => {
    navigate(`/bank-transactions/${id}/approve`);
  }, [navigate]);

  const handleDownload = useCallback((id) => {
    // TODO: Implement download functionality
    console.log('Download bank-transactions transaction:', id);
  }, []);

  const columns = [
    {
      name: 'Transaction ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      cell: row => row.date ? new Date(row.date).toLocaleDateString() : '—',
    },
    {
      name: 'Direction',
      selector: row => row.direction,
      sortable: true,
      cell: row => (
        <span>
          {row.direction === 'in' ? 'Expense' : 'Income'}
        </span>
      ),
    },
    {
      name: 'Category',
      selector: row => row.TransactionCategory?.name,
      sortable: true,
      cell: row => row.TransactionCategory?.name || '—',
    },
    {
      name: 'Account Number',
      selector: row => row.accountNumber,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Invoice ID',
      selector: row => row.invoiceId,
      sortable: true,
    },
    {
      name: 'Partner',
      selector: row => row.BusinessPartner?.name,
      sortable: true,
      cell: row => row.BusinessPartner?.name || '—',
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      cell: row => row.amount ? `${parseFloat(row.amount).toFixed(2)} KM` : '—',
      style: { textAlign: 'right' },
    },
    {
      name: 'Status',
      selector: row => {
        if (row.approvedAt || row.approvedBy) return 'Approved';
        return 'Pending';
      },
      sortable: true,
      width: '130px',
      cell: row => {
        const status = row.approvedAt || row.approvedBy ? 'Approved' : 'Pending';
        return (
          <span className={`status-badge ${status === 'Approved' ? 'approved' : 'pending'}`}>
            {status}
          </span>
        );
      },
    },
    {
      name: 'Actions',
      cell: row => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onApprove={() => handleApprove(row.id)}
          onDownload={handleDownload}
          isApproved={Boolean(row.approvedAt || row.approvedBy)}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer bank-transactions-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <DynamicTable
          title="Bank Transactions"
          columns={columns}
          apiEndpoint={apiEndpoint}
          uploadButton={<UploadButton bucketName={bucketName} />}
        />
      </div>
    </DefaultLayout>
  );
};

export default BankTransactions;
