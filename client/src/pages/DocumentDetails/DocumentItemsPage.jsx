import { useMemo, useState } from 'react';
import EditItemModal from '../../components/Modals/EditItemModal';
import api from '../../services/api';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import DynamicTable from '../../components/Tables/DynamicTable';
import AppButton from '../../components/AppButton/AppButton';
import './DocumentItemsPage.css';

const n2 = (v) => (v == null || v === '' ? null : Number(String(v).replace(',', '.')));
const r2 = (v) => (v == null || Number.isNaN(v) ? null : Math.round((v + Number.EPSILON) * 100) / 100);

const DocumentItemsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const documentType = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/kif/')) return 'kif';
    if (path.includes('/kuf/')) return 'kuf';
    if (path.includes('/bank-transactions/')) return 'bank-transactions';
    return null;
  }, [location.pathname]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint = `${API_BASE}/${documentType}/${id}/items`;

  // Modal edit state
  const [editModal, setEditModal] = useState({ visible: false, row: null, type: null });
  const [modalForm, setModalForm] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Open/close modal
  const openEditModal = (row, type) => {
    setEditModal({ visible: true, row, type });
    setModalForm({ ...row });
    setModalError('');
  };
  const closeEditModal = () => {
    setEditModal({ visible: false, row: null, type: null });
    setModalForm({});
    setModalError('');
  };
  const handleModalFormChange = (newForm) => setModalForm(newForm);

  // --- Core: infer missing numeric fields before saving (KIF focus) ---
  const normalizeKifItem = (form) => {
    let quantity = n2(form.quantity);
    let unitPrice = n2(form.unitPrice);
    let netSubtotal = n2(form.netSubtotal);
    let vatAmount = n2(form.vatAmount);
    let grossSubtotal = n2(form.grossSubtotal);

    // If we have q & p, recompute net
    if (quantity != null && unitPrice != null) {
      netSubtotal = r2(quantity * unitPrice);
    }
    // If we have q & net but missing p
    else if (quantity != null && netSubtotal != null && unitPrice == null && quantity !== 0) {
      unitPrice = r2(netSubtotal / quantity);
    }
    // If we have p & net but missing q
    else if (unitPrice != null && netSubtotal != null && quantity == null && unitPrice !== 0) {
      quantity = r2(netSubtotal / unitPrice);
    }
    // If only net exists → default q=1
    else if (netSubtotal != null && quantity == null && unitPrice == null) {
      quantity = 1;
      unitPrice = r2(netSubtotal);
    }

    // If both net & VAT exist, recompute gross
    if (netSubtotal != null && vatAmount != null) {
      grossSubtotal = r2(netSubtotal + vatAmount);
    }
    // If only gross provided and net missing but we have VAT → infer net = gross - VAT
    else if (grossSubtotal != null && vatAmount != null && netSubtotal == null) {
      netSubtotal = r2(grossSubtotal - vatAmount);
      if (quantity != null && unitPrice == null && quantity !== 0) {
        unitPrice = r2(netSubtotal / quantity);
      } else if (unitPrice != null && quantity == null && unitPrice !== 0) {
        quantity = r2(netSubtotal / unitPrice);
      }
    }

    return {
      ...form,
      quantity: quantity != null ? quantity : null,
      unitPrice: unitPrice != null ? unitPrice : null,
      netSubtotal: netSubtotal != null ? netSubtotal : null,
      vatAmount: vatAmount != null ? vatAmount : null,
      grossSubtotal: grossSubtotal != null ? grossSubtotal : null,
    };
  };

  // Save edited row
  const handleModalSave = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      let payload = { ...modalForm };

      if (editModal.type === 'kif') {
        payload = normalizeKifItem(payload);
      }

      ['quantity', 'unitPrice', 'netSubtotal', 'vatAmount', 'grossSubtotal', 'lumpSum'].forEach((k) => {
        if (payload[k] !== null && payload[k] !== undefined && Number.isNaN(Number(payload[k]))) {
          payload[k] = null;
        }
      });

      await api.put(`/${editModal.type}/items/${editModal.row.id}`, payload);
      closeEditModal();
    } catch (e) {
      console.error(e);
      setModalError('Save failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Add Actions column
  const getActionsColumn = (columns, type) => [
    ...columns,
    {
      name: 'Actions',
      cell: (row) => (
        <AppButton
          size="sm"
          variant="secondary"
          onClick={() => openEditModal(row, type)}
          icon="mdi:pencil"
        />
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  // Columns
const kifColumns = [
    { name: 'ID', selector: (row) => row.id, minWidth: '120px', wrap: true },
    { name: 'Order Number', selector: (row) => row.orderNumber ?? '—', minWidth: '120px', wrap: true },
    { name: 'Description', selector: (row) => row.description ?? '—', minWidth: '160px', wrap: true },
    { name: 'Unit', selector: (row) => row.unit ?? '—', minWidth: '100px', wrap: true },

  {
    name: 'Quantity',
    selector: (row) => {
      const q = n2(row.quantity);
      const p = n2(row.unitPrice);
      const net = n2(row.netSubtotal);
      if (q != null) return q;
      if (p != null && (net != null || net == null)) return 1; 
      return '—';
    },
    minWidth: '100px',
    wrap: true,
  },

  { name: 'Unit Price', selector: (row) => (row.unitPrice != null ? row.unitPrice : '—'), minWidth: '120px', wrap: true },

  {
    name: 'Net Subtotal',
    selector: (row) => {
      const net = n2(row.netSubtotal);
      if (net != null) return net;
      const q = n2(row.quantity);
      const p = n2(row.unitPrice);
      if (p == null) return '—';
      const effQ = q != null ? q : 1;
      return r2(effQ * p);
    },
    minWidth: '120px',
    wrap: true,
  },

  { name: 'VAT Amount', selector: (row) => (row.vatAmount != null ? row.vatAmount : '—'), minWidth: '120px', wrap: true },

  {
    name: 'Gross Subtotal',
    selector: (row) => {
      const gross = n2(row.grossSubtotal);
      if (gross != null) return gross;
      const net = n2(row.netSubtotal);
      if (net != null) return net;
      const q = n2(row.quantity);
      const p = n2(row.unitPrice);
      if (p == null) return '—';
      const effQ = q != null ? q : 1;
      return r2(effQ * p);
    },
    minWidth: '120px',
    wrap: true,
  },
];

  const kufColumns = [
    { name: 'ID', selector: (row) => row.id, minWidth: '120px', wrap: true },
    { name: 'Order Number', selector: (row) => row.orderNumber ?? '—', minWidth: '120px', wrap: true },
    { name: 'Description', selector: (row) => row.description ?? '—', minWidth: '160px', wrap: true },
    { name: 'Net Subtotal', selector: (row) => (row.netSubtotal != null ? row.netSubtotal : '—'), minWidth: '120px', wrap: true },
    { name: 'Lump Sum', selector: (row) => (row.lumpSum != null ? row.lumpSum : '—'), minWidth: '120px', wrap: true },
    { name: 'VAT Amount', selector: (row) => (row.vatAmount != null ? row.vatAmount : '—'), minWidth: '120px', wrap: true },
    { name: 'Gross Subtotal', selector: (row) => (row.grossSubtotal != null ? row.grossSubtotal : '—'), minWidth: '120px', wrap: true },
  ];

  const bankTransactionColumns = [
    {
      selector: (row) => row.date || '—',
      sortable: true,
      cell: (row) => (row.date ? new Date(row.date).toLocaleDateString() : '—'),
    },
    { name: 'Description', selector: (row) => row.description ?? '—', wrap: true },
    { name: 'Amount', selector: (row) => (row.amount != null ? row.amount : '—'), wrap: true },
    { name: 'Bank Name', selector: (row) => row.bankName ?? '—', wrap: true },
    { name: 'Account Number', selector: (row) => row.accountNumber ?? '—', wrap: true },
    { name: 'Direction', selector: (row) => row.direction ?? '—', wrap: true },
  ];

  const columns =
    documentType === 'kif'
      ? getActionsColumn(kifColumns, 'kif')
      : documentType === 'kuf'
      ? getActionsColumn(kufColumns, 'kuf')
      : documentType === 'bank-transactions'
      ? getActionsColumn(bankTransactionColumns, 'bank-transactions')
      : [];

  const backUrl = location.state?.backUrl || `/${documentType}/${id}`;

  const getFormFields = () => {
    if (!editModal.row) return [];
    if (editModal.type === 'kif') {
      return [
        { name: 'orderNumber', label: 'Order Number', type: 'text', placeholder: 'Order Number', readOnly: true },
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
        { name: 'unit', label: 'Unit', type: 'text', placeholder: 'Unit' },
        { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Quantity' },
        { name: 'unitPrice', label: 'Unit Price', type: 'number', placeholder: 'Unit Price' },
        { name: 'netSubtotal', label: 'Net Subtotal', type: 'number', placeholder: 'Net Subtotal' },
        { name: 'vatAmount', label: 'VAT Amount', type: 'number', placeholder: 'VAT Amount' },
        { name: 'grossSubtotal', label: 'Gross Subtotal', type: 'number', placeholder: 'Gross Subtotal' },
      ];
    } else if (editModal.type === 'kuf') {
      return [
        { name: 'orderNumber', label: 'Order Number', type: 'text', placeholder: 'Order Number', readOnly: true },
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
        { name: 'netSubtotal', label: 'Net Subtotal', type: 'number', placeholder: 'Net Subtotal' },
        { name: 'lumpSum', label: 'Lump Sum', type: 'number', placeholder: 'Lump Sum' },
        { name: 'vatAmount', label: 'VAT Amount', type: 'number', placeholder: 'VAT Amount' },
        { name: 'grossSubtotal', label: 'Gross Subtotal', type: 'number', placeholder: 'Gross Subtotal' },
      ];
    } else if (editModal.type === 'bank-transactions') {
      return [
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
        { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Amount' },
        { name: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'Bank Name' },
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account Number' },
        { name: 'direction', label: 'Direction', type: 'select', options: ['in', 'out'], placeholder: 'Direction' },
      ];
    }
  };

  return (
    <DefaultLayout>
      <div className="table-page-outer" style={{ left: 0, right: 0 }}>
        <div className="document-items-table-scroll document-items-table-responsive">
          <DynamicTable
            title="Document Items"
            columns={columns}
            apiEndpoint={apiEndpoint}
            pagination={false}
            reloadTable={editModal.visible === false && !modalLoading ? Math.random() : undefined}
          />
        </div>
        <EditItemModal
          visible={editModal.visible}
          onCancel={closeEditModal}
          onConfirm={handleModalSave}
          formData={modalForm}
          onFormChange={handleModalFormChange}
          formFields={getFormFields()}
          loading={modalLoading}
          error={modalError}
          // (Optional) inform user we may infer values
          helperText={
            editModal.type === 'kif'
              ? 'Tip: If Quantity or Unit Price is missing, they will be inferred from Net Subtotal (or vice versa) on Save.'
              : undefined
          }
        />
      </div>
    </DefaultLayout>
  );
};

export default DocumentItemsPage;
