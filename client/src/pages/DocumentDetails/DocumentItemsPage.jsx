import { cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CContainer,
    CRow,
    CSpinner,
} from '@coreui/react';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import DefaultLayout from '../../layout/DefaultLayout';
import DynamicTable from '../../components/Tables/DynamicTable';
import '../../styles/shared/CommonStyles.css';

const DocumentItemsPage = () => {
    const { id } = useParams();
    const location = useLocation();
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

    // Get backUrl from location.state, fallback to details page for this document
    const backUrl = location.state?.backUrl || `/${documentType}/${id}`;

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">
                    <CRow className="justify-content-center">
                        <CCol lg={10} className="mb-4">
                            <CCard className="h-70 shadow-sm detail-card mb-4">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                                        {documentType ? `${documentType.toUpperCase()} Items` : 'Document Items'}
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => window.history.back() || window.location.assign(backUrl)}
                                        >
                                            Back to Details
                                        </button>
                                    </div>
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
            </div>
        </DefaultLayout>
    );
};

export default DocumentItemsPage;