import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import KufService from '../../services/kuf';
import { activityLogService } from '../../services/activityLogService';
import './Kuf.styles.css';
import { useSelector } from 'react-redux';
import KufService from '../../services/kuf';

const Kuf = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/kuf`, [API_BASE]);
  const user = useSelector((state) => state.user.profile);

  const handleView = useCallback(
    (id) => {
      navigate(`/kuf/${id}`);
      logActivity({
        userId: user.id,
        action: 'view',
        entity: 'kuf',
        entityId: id,
      });
    },
    [navigate]
  );

  const handleApprove = useCallback(
    (id) => {
      navigate(`/kuf/${id}/approve`);
      logActivity({
        userId: user.id,
        action: 'approve',
        entity: 'kuf',
        entityId: id,
      });
    },
    [navigate]
  );

  const handleDownload = useCallback(async (id) => {
    try {
      const response = await KufService.getKufById(id);
      const documentData = response.data;

      if (!documentData?.pdfUrl) {
        console.error('No pdfUrl found for this document');
        return;
      }

      const link = document.createElement('a');
      link.href = documentData.pdfUrl;
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
      name: 'Invoice ID',
      selector: (row) => row.id,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Invoice Number',
      selector: (row) => row.invoiceNumber,
      sortable: true,
      width: '190px',
    },
    {
      name: 'Invoice Type',
      selector: (row) => row.invoiceType,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customerName,
      sortable: true,
      width: '190px',
    },
    {
      name: 'Invoice Date',
      selector: (row) => row.invoiceDate,
      sortable: true,
      width: '160px',
      cell: (row) => (row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Due Date',
      selector: (row) => row.dueDate,
      sortable: true,
      width: '140px',
      cell: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'),
    },
    {
      name: 'Total Amount',
      selector: (row) => row.totalAmount,
      sortable: true,
      width: '170px',
      cell: (row) => (row.totalAmount ? `${parseFloat(row.totalAmount).toFixed(2)} KM` : '—'),
      style: { textAlign: 'right' },
    },
    {
      name: 'VAT Period',
      selector: (row) => row.vatPeriod,
      sortable: true,
      width: '150px',
    },
    {
      name: 'VAT Category',
      selector: (row) => row.vatCategory,
      sortable: true,
      width: '170px',
    },
    {
      name: 'Delivery Period',
      selector: (row) => row.deliveryPeriod,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Bill Number',
      selector: (row) => row.billNumber,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Approval Status',
      selector: (row) => {
        if (row.approvedAt || row.approvedBy) return 'Approved';
        return 'Pending';
      },
      sortable: true,
      width: '190px',
      cell: (row) => {
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
      cell: (row) => (
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
        className="table-page-outer kuf-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <DynamicTable
          title="KUF - Purchase Invoices"
          columns={columns}
          apiEndpoint={apiEndpoint}
          uploadButton={<UploadButton bucketName={bucketName} />}
        />
      </div>
    </DefaultLayout>
  );
};

export default Kuf;
