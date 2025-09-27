import { useMemo, useState } from 'react';
import EditItemModal from '../../components/Modals/EditItemModal';
import api from '../../services/api';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import DynamicTable from '../../components/Tables/DynamicTable';
import AppButton from '../../components/AppButton/AppButton';


const DocumentItemsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const documentType = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/kif/')) return 'kif';
        if (path.includes('/kuf/')) return 'kuf';
        if (path.includes('/bank-transactions/')) return 'transactions/bank-transaction-data';
        return null;
    }, [location.pathname]);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const apiEndpoint = `${API_BASE}/${documentType}/${id}/items`;


    // Modal edit state
    const [editModal, setEditModal] = useState({ visible: false, row: null, type: null });
    const [modalForm, setModalForm] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');

    // Open modal with row data
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

    // Save edited row to API from modal
    const handleModalSave = async () => {
        setModalLoading(true);
        setModalError('');
        try {
            await api.put(`/${editModal.type}/items/${editModal.row.id}`, modalForm);
            closeEditModal();
        } catch (e) {
            setModalError('Save failed');
        } finally {
            setModalLoading(false);
        }
    };

    // Add Actions column
    const getActionsColumn = (columns, type) => ([
        ...columns,
        {
            name: 'Actions',
            cell: row => (
                <AppButton
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(row, type)}
                    icon="mdi:pencil"
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ]);

    // Columns for KIF (SalesInvoiceItem)
    const kifColumns = [
        { name: 'ID', selector: row => row.id, minWidth: '120px', wrap: true },
        { name: 'Order Number', selector: row => row.orderNumber, minWidth: '120px', wrap: true },
        { name: 'Description', selector: row => row.description, minWidth: '160px', wrap: true },
        { name: 'Unit', selector: row => row.unit, minWidth: '100px', wrap: true },
        { name: 'Quantity', selector: row => row.quantity, minWidth: '100px', wrap: true },
        { name: 'Unit Price', selector: row => row.unitPrice, minWidth: '120px', wrap: true },
        { name: 'Net Subtotal', selector: row => row.netSubtotal, minWidth: '120px', wrap: true },
        { name: 'VAT Amount', selector: row => row.vatAmount, minWidth: '120px', wrap: true },
        { name: 'Gross Subtotal', selector: row => row.grossSubtotal, minWidth: '120px', wrap: true },
    ];

    // Columns for KUF (PurchaseInvoiceItem)
    const kufColumns = [
        { name: 'ID', selector: row => row.id, minWidth: '120px', wrap: true },
        { name: 'Order Number', selector: row => row.orderNumber, minWidth: '120px', wrap: true },
        { name: 'Description', selector: row => row.description, minWidth: '160px', wrap: true },
        { name: 'Net Subtotal', selector: row => row.netSubtotal, minWidth: '120px', wrap: true },
        { name: 'Lump Sum', selector: row => row.lumpSum, minWidth: '120px', wrap: true },
        { name: 'VAT Amount', selector: row => row.vatAmount, minWidth: '120px', wrap: true },
        { name: 'Gross Subtotal', selector: row => row.grossSubtotal, minWidth: '120px', wrap: true },
    ];

    const bankTransactionColumns = [
        { name: 'ID', selector: row => row.id, minWidth: '120px', wrap: true },
        { name: 'Description', selector: row => row.description, minWidth: '160px', wrap: true },
        { name: 'Amount', selector: row => row.amount, minWidth: '120px', wrap: true },
        {
            name: 'Date', selector: row => {
                if (!row.date) return '';
                const d = new Date(row.date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = String(d.getFullYear()).slice(-2);
                return `${day}.${month}.${year}`;
            }, minWidth: '120px', wrap: true
        },
        { name: 'Bank Name', selector: row => row.bankName, minWidth: '140px', wrap: true },
        { name: 'Account Number', selector: row => row.accountNumber, minWidth: '140px', wrap: true },
        { name: 'Direction', selector: row => row.direction, minWidth: '100px', wrap: true },
    ];


    const columns = documentType === 'kif'
        ? getActionsColumn(kifColumns, 'kif')
        : documentType === 'kuf'
            ? getActionsColumn(kufColumns, 'kuf')
            : documentType === 'transactions/bank-transaction-data'
                ? getActionsColumn(bankTransactionColumns, 'bank-transaction-data')
                : [];

    // Determine back URL
    const backUrl = location.state?.backUrl || `/${documentType}/${id}`;

    // Modal form fields
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
        } else if (editModal.type === 'transactions/bank-transaction-data') {
            return [
                { name: 'id', label: 'ID', type: 'text', placeholder: 'ID', readOnly: true },
                { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
                { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Amount' },
                { name: 'date', label: 'Date', type: 'date', placeholder: 'Date' },
                { name: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'Bank Name' },
                { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account Number' },
                { name: 'direction', label: 'Direction', type: 'select', options: ['in', 'out'], placeholder: 'Direction' },
            ];
        }
    };

    return (
        <DefaultLayout>
            <div style={{ marginTop: '30px' }}>
                <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <DynamicTable
                        title="Invoice Items"
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
                />
            </div>
        </DefaultLayout>
    );
};

export default DocumentItemsPage;