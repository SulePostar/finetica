import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Partner.css';

const Partner = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = useMemo(() => `${API_BASE}/partners`, [API_BASE]);

  const [reloadTable, setReloadTable] = useState(false);

  const handleView = useCallback(
    (id) => {
      navigate(`/partners/${id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/partners/${id}/edit`);
    },
    [navigate]
  );

  // Store full row for modal
  const handleDelete = useCallback((row) => {
    setPartnerToDelete(row);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!partnerToDelete) return;

    console.log('Deleting partner ID:', partnerToDelete.id);

    try {
      const response = await fetch(`${apiEndpoint}/${partnerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete partner: ${text}`);
      }

      console.log('Successfully deleted partner:', partnerToDelete.id);
      setReloadTable(prev => !prev);
    } catch (error) {
      console.error('Error deleting partner:', error);
    } finally {
      setDeleteModalVisible(false);
      setPartnerToDelete(null);
    }
  }, [partnerToDelete, apiEndpoint]);


  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '100px' },
    { name: 'Type', selector: row => row.type, sortable: true, width: '150px' },
    { name: 'Name', selector: row => row.name, sortable: true, wrap: true, width: '200px' },
    { name: 'Short Name', selector: row => row.shortName, sortable: true, width: '180px' },
    { name: 'Country Code', selector: row => row.countryCode, sortable: true, width: '150px' },
    { name: 'VAT Number', selector: row => row.vatNumber, sortable: true, width: '180px' },
    { name: 'Tax ID', selector: row => row.taxId, sortable: true, width: '180px' },
    { name: 'Registration No.', selector: row => row.registrationNumber, sortable: true, width: '200px' },
    {
      name: 'VAT Registered',
      selector: row => row.is_vat_registered,
      sortable: true,
      width: '160px',
      cell: row => (
        <span className={`status-badge ${row.is_vat_registered ? 'active' : 'inactive'}`}>
          {row.is_vat_registered ? 'Yes' : 'No'}
        </span>
      ),
    },
    { name: 'Address', selector: row => row.address, sortable: true, wrap: true, width: '250px' },
    { name: 'City', selector: row => row.city, sortable: true, width: '180px' },
    { name: 'Postal Code', selector: row => row.postalCode, sortable: true, width: '150px' },
    { name: 'Email', selector: row => row.email, sortable: true, width: '220px' },
    { name: 'Phone', selector: row => row.phone, sortable: true, width: '180px' },
    { name: 'IBAN', selector: row => row.iban, sortable: true, width: '250px' },
    { name: 'Bank Name', selector: row => row.bankName, sortable: true, width: '200px' },
    { name: 'SWIFT Code', selector: row => row.swiftCode, sortable: true, width: '160px' },
    { name: 'Default Currency', selector: row => row.defaultCurrency, sortable: true, width: '160px' },
    { name: 'Language Code', selector: row => row.languageCode, sortable: true, width: '160px' },
    { name: 'Payment Terms', selector: row => row.paymentTerms, sortable: true, wrap: true, width: '200px' },
    {
      name: 'Status',
      selector: row => row.isActive,
      sortable: true,
      width: '120px',
      cell: row => (
        <span className={`status-badge ${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { name: 'Note', selector: row => row.note, sortable: true, wrap: true, width: '200px' },
    {
      name: 'Actions',
      width: '140px',
      cell: row => (
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
      allowOverflow: true,
    }
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer partner-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="partner-table-responsive">
          <DynamicTable title="Partners" columns={columns} apiEndpoint={apiEndpoint} reload={reloadTable} />
        </div>
      </div>

      <CModal
        alignment="center"
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete partner with ID: {partnerToDelete?.id}? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={confirmDelete}
            disabled={!partnerToDelete?.isActive} // disabled if inactive
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </DefaultLayout>
  );
};

export default Partner;