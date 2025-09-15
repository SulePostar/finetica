import { cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CContainer,
    CRow,
} from '@coreui/react';
import { useMemo } from 'react';
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

    const columns = documentType === 'kif' ? kifColumns : kufColumns;
    const backUrl = location.state?.backUrl || `/${documentType}/${id}`;

    return (
        <DefaultLayout>
            <main>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol lg={10}>
                            <CCard>
                                <CCardHeader>
                                    <CCardTitle>
                                        <CIcon icon={cilFile} />
                                        {documentType ? `${documentType.toUpperCase()} Items` : 'Document Items'}
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <CButton
                                        color="secondary"
                                        variant="outline"
                                        onClick={() => navigate(backUrl)}
                                    >
                                        Back to Details
                                    </CButton>
                                    <DynamicTable
                                        title="Invoice Items"
                                        columns={columns}
                                        apiEndpoint={apiEndpoint}
                                        pagination={false}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </main>
        </DefaultLayout>
    );
};

export default DocumentItemsPage;