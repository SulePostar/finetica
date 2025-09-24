import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import KufService from '../../services/kuf';
import './Kuf.css';

const Kuf = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/kuf`, [API_BASE]);

  const [refetchFn, setRefetchFn] = useState(null);
  const onRefetch = useCallback((fn) => setRefetchFn(() => fn), []);

  const handleView = useCallback((id) => navigate(`/kuf/${id}`), [navigate]);
  const handleApprove = useCallback((id) => navigate(`/kuf/${id}/approve`), [navigate]);

  const handleDownload = useCallback(async (id) => {
    try {
      const { data } = await KufService.getKufById(id);
      if (!data?.pdfUrl) return;
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `kuf-${id}.pdf`;
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
    },
    {
      name: 'Invoice Type',
      selector: (row) => row.invoiceType || '—',
      sortable: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.customerName || '—',
      sortable: true,
    },
    {
      name: 'Invoice Date',
      selector: (row) => row.invoiceDate || '—',
      sortable: true,
      cell: (row) => (row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Due Date',
      selector: (row) => row.dueDate || '—',
      sortable: true,
      cell: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Total Amount',
      selector: (row) => (row.lumpSum != null ? row.lumpSum : row.netTotal ?? '—'),
      sortable: true,
      cell: (row) =>
        row.lumpSum != null
          ? `${parseFloat(row.lumpSum).toFixed(2)} KM`
          : `${parseFloat(row.netTotal).toFixed(2)} KM` ?? '—',
      style: { textAlign: 'right' },
    },
    {
      name: 'Review',
      selector: (row) => (row.approvedAt || row.approvedBy ? 'Approved' : 'Pending'),
      sortable: true,
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
        <div className="kuf-table-scroll kuf-table-responsive">
          <DynamicTable
            title="KUF - Purchase Invoices"
            columns={columns}
            apiEndpoint={apiEndpoint}
            uploadButton={
              <UploadButton
                bucketName={bucketName}
                onUploadSuccess={() => {
                  if (refetchFn) refetchFn();
                }}
              />
            }
            onRefetch={onRefetch}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Kuf;
