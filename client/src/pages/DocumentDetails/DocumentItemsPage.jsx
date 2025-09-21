import { CButton } from '@coreui/react';
import { cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useMemo, useState } from 'react';
import EditItemModal from '../../components/Modals/EditItemModal';
import api from '../../services/api';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import DynamicTable from '../../components/Tables/DynamicTable';

const DocumentItemsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const documentType = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/kif/')) return 'kif';
        if (path.includes('/kuf/')) return 'kuf';
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
                <CButton size="sm" color="primary" onClick={() => openEditModal(row, type)}>
                    Edit
                </CButton>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ]);

    // Columns for KIF (SalesInvoiceItem)
    const kifColumns = [
        { name: 'ID', selector: row => row.id },
        { name: 'Order Number', selector: row => row.orderNumber },
        { name: 'Description', selector: row => row.description },
        { name: 'Unit', selector: row => row.unit },
        { name: 'Quantity', selector: row => row.quantity },
        { name: 'Unit Price', selector: row => row.unitPrice },
        { name: 'Net Subtotal', selector: row => row.netSubtotal },
        { name: 'VAT Amount', selector: row => row.vatAmount },
        { name: 'Gross Subtotal', selector: row => row.grossSubtotal },
    ];

    // Columns for KUF (PurchaseInvoiceItem)
    const kufColumns = [
        { name: 'ID', selector: row => row.id },
        { name: 'Order Number', selector: row => row.orderNumber },
        { name: 'Description', selector: row => row.description },
        { name: 'Net Subtotal', selector: row => row.netSubtotal },
        { name: 'Lump Sum', selector: row => row.lumpSum },
        { name: 'VAT Amount', selector: row => row.vatAmount },
        { name: 'Gross Subtotal', selector: row => row.grossSubtotal },
    ];

    const columns = documentType === 'kif' ? getActionsColumn(kifColumns, 'kif') : getActionsColumn(kufColumns, 'kuf');
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
        } else {
            return [
                { name: 'orderNumber', label: 'Order Number', type: 'text', placeholder: 'Order Number', readOnly: true },
                { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
                { name: 'netSubtotal', label: 'Net Subtotal', type: 'number', placeholder: 'Net Subtotal' },
                { name: 'lumpSum', label: 'Lump Sum', type: 'number', placeholder: 'Lump Sum' },
                { name: 'vatAmount', label: 'VAT Amount', type: 'number', placeholder: 'VAT Amount' },
                { name: 'grossSubtotal', label: 'Gross Subtotal', type: 'number', placeholder: 'Gross Subtotal' },
            ];
        }
    };

    return (
        <DefaultLayout>
            <main>
                <CButton
                    color="primary"
                    style={{
                        backgroundColor: '#5850a6',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        marginBottom: '20px',
                        marginLeft: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => navigate(backUrl)}
                >
                    <CIcon icon={cilArrowLeft} size="lg" style={{ color: 'white' }} />
                </CButton>
                <DynamicTable
                    title="Invoice Items"
                    columns={columns}
                    apiEndpoint={apiEndpoint}
                    pagination={false}
                    reloadTable={editModal.visible === false && !modalLoading ? Math.random() : undefined}
                />
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
            </main>
        </DefaultLayout>
    );
};

export default DocumentItemsPage;