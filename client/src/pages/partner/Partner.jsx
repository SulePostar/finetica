import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Partner.css';

const Partner = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refetchFunction, setRefetchFunction] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/partners`, [API_BASE]);

  const handleView = useCallback((id) => navigate(`/partners/${id}`), [navigate]);
  const handleEdit = useCallback((id) => navigate(`/partners/${id}/edit`), [navigate]);

  const handleDelete = useCallback((row) => {
    setPartnerToDelete(row);
    setDeleteModalVisible(true);
    setError('');
  }, []);


  const handleCloseModal = useCallback(() => {
    setDeleteModalVisible(false);
    setPartnerToDelete(null);
    setLoading(false);
    setError('');
  }, []);


  const confirmDelete = useCallback(async () => {
    if (!partnerToDelete) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiEndpoint}/${partnerToDelete.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify({ isActive: false }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to deactivate partner: ${text}`);
      }
      if (refetchFunction) await refetchFunction();
      handleCloseModal();
    } catch (err) {
      console.error('Error deactivating partner:', err);
      setError('Failed to delete partner. Please try again.');
      setLoading(false);
    }
  }, [partnerToDelete, refetchFunction, handleCloseModal, apiEndpoint]);


  const handleRefetchCallback = useCallback((fetchFn) => {
    setRefetchFunction(() => fetchFn);
  }, []);


  const columns = [
    {
      name: 'Short Name',
      selector: (row) => row.shortName || '—',
      sortable: true,
      minWidth: '160px', 
      maxWidth: '200px',
      grow: 0,         
    },
    {
      name: 'Email',
      selector: (row) => row.email || '—',
      sortable: true,
      minWidth: '250px', 
      grow: 1,           
      wrap: true,
      hideAtOrBelow: 'md',
      hideBelow: 1440,
    },
    {
      name: 'Type',
      selector: (row) => row.type || '—',
      sortable: true,
      minWidth: '140px',
      grow: 0,
    },
    {
      name: 'Bank Name',
      selector: (row) => row.bankName || '—',
      sortable: true,
      minWidth: '170px',
      wrap: true,
      grow: 0,
      hideAtOrBelow: 'md',
      hideBelow: 1024,
    },
    {
      name: 'Status',
      selector: (row) => row.isActive,
      sortable: true,
      minWidth: '120px',
      center: true,
      cell: (row) => (
        <span className={`status-badge ${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'Payment Terms',
      selector: (row) => row.paymentTerms,
      sortable: true,
      minWidth: '120px',
      cell: (row) => (
          row.paymentTerms ? row.paymentTerms : '—'
      ),
      hideAtOrBelow: 'md',
    },
    {
      name: 'Actions',
      minWidth: '140px',
      cell: (row) => (
        <ActionsDropdown
          row={row}
          onView={() => handleView(row.id)}
          onEdit={() => handleEdit(row.id)}
          onDelete={row.isActive ? () => handleDelete(row) : null}
          disableDelete={!row.isActive}
          isSaved={row.updated_at && new Date(row.updated_at) > new Date(row.created_at)}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer"
        style={{ left: sidebarWidth + 24, right: 24 }}
      >
        <div className="partner-table-scroll partner-table-responsive">
          <DynamicTable
            title="Partners"
            columns={columns}
            apiEndpoint={apiEndpoint}
            onRefetch={handleRefetchCallback}
          />
        </div>
      </div>

      <ConfirmationModal
        visible={deleteModalVisible}
        onCancel={handleCloseModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        body={`Are you sure you want to delete partner ${partnerToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        loading={loading}
        error={error}
      />
    </DefaultLayout>
  );
};

export default Partner;



