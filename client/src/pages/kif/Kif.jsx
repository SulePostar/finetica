import { useCallback, useMemo } from 'react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import './Kif.css';

const Kif = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/kif`, [API_BASE]);

  const handleView = useCallback((id) => {
    navigate(`/kif/${id}`);
  }, [navigate]);

  const handleApprove = useCallback((id) => {
    navigate(`/kif/${id}/approve`);
  }, [navigate]);

  const handleDownload = useCallback((id) => {
    // TODO: Implement download functionality
    console.log('Download KIF:', id);
  }, []);

  const columns = [
    {
      name: 'Invoice ID',
      selector: row => row.id,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Invoice Number',
      selector: row => row.invoiceNumber,
      sortable: true,
      width: '190px',
    },
    {
      name: 'Invoice Type',
      selector: row => row.invoiceType,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Customer Name',
      selector: row => row.customerName,
      sortable: true,
      width: '190px',
    },
    {
      name: 'Invoice Date',
      selector: row => row.invoiceDate,
      sortable: true,
      width: '160px',
      cell: row => row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : '—',
    },
    {
      name: 'Due Date',
      selector: row => row.dueDate,
      sortable: true,
      width: '140px',
      cell: row => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—',
    },
    {
      name: 'Total Amount',
      selector: row => row.totalAmount,
      sortable: true,
      width: '170px',
      cell: row => row.totalAmount ? `${parseFloat(row.totalAmount).toFixed(2)} KM` : '—',
      style: { textAlign: 'right' },
    },
    {
      name: 'VAT Period',
      selector: row => row.vatPeriod,
      sortable: true,
      width: '150px',
    },
    {
      name: 'VAT Category',
      selector: row => row.vatCategory,
      sortable: true,
      width: '170px',
    },
    {
      name: 'Delivery Period',
      selector: row => row.deliveryPeriod,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Bill Number',
      selector: row => row.billNumber,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Approval Status',
      selector: row => {
        if (row.approvedAt || row.approvedBy) return 'Approved';
        return 'Pending';
      },
      sortable: true,
      width: '190px',
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
      width: '140px',
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
        className="table-page-outer kif-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="kif-table-responsive">
          <DynamicTable
            title="KIF - Sales Invoices"
            columns={columns}
            apiEndpoint={apiEndpoint}
            uploadButton={<UploadButton bucketName={bucketName} />}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Kif;