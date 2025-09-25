import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import KifService from '../../services/kif';
import './Kif.css';

const Kif = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/kif`, [API_BASE]);

  const [refetchFunction, setRefetchFunction] = useState(null);
  const handleRefetchCallback = useCallback((fn) => setRefetchFunction(() => fn), []);

  const handleView = useCallback((id) => navigate(`/kif/${id}`), [navigate]);
  const handleApprove = useCallback((id) => navigate(`/kif/${id}/approve`), [navigate]);

  const handleDownload = useCallback(async (id) => {
    try {
      const { data } = await KifService.getById(id);
      if (!data?.pdfUrl) return;
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `kif-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, []);

  const columns = [
    {
      name: 'Invoice Number',
      selector: (row) => row.invoiceNumber || '—',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Invoice Type',
      selector: (row) => row.invoiceType || '—',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Customer',
      width:"140px",
      selector: (row) => row.customerName || '—',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Invoice Date',
      selector: (row) => row.invoiceDate || '—',
      sortable: true,
      cell: (row) => (row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Due Date',
      width:"150px",
      selector: (row) => row.dueDate || '—',
      sortable: true,
      cell: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Total Amount',
      selector: (row) => (row.totalAmount != null ? row.totalAmount : '—'),
      sortable: true,
      cell: (row) =>
        row.totalAmount != null ? `${parseFloat(row.totalAmount).toFixed(2)} KM` : '—',
      style: { textAlign: 'right' },
    },
    {
      name: 'Review',
      width:"120px",
      selector: (row) => (row.approvedAt || row.approvedBy ? 'Approved' : 'Pending'),
      sortable: true,
      wrap: true,
      cell: (row) => {
        const status = row.approvedAt || row.approvedBy ? 'approved' : 'pending';
        return (
          <span className={`status-badge ${status}`}>
            {status === 'approved' ? 'Approved' : 'Pending'}
          </span>
        );
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
        <div className="kif-table-scroll kif-table-responsive">
          <DynamicTable
            title="KIF - Sales Invoices"
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

export default Kif;
