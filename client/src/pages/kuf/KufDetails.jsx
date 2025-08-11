import { cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CContainer,
    CRow
} from '@coreui/react';
import { useParams } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import '../../components/InfoCards/DocumentInfo.styles.css';

const KufDetails = () => {
    const { id } = useParams();


    const mockKufData = {
        id: id || '1',
        documentNumber: 'KUF-2024-001',
        invoice_number: 'INV-2024-001',
        bill_number: 'BILL-2024-001',
        supplier_name: 'Sample Supplier Ltd.',
        supplier_id: '123456789',
        vat_period: '2024-01',
        invoice_type: 'Standard',
        invoice_date: '2024-01-15',
        due_date: '2024-02-15',
        received_date: '2024-01-16',
        net_total: 3000.00,
        lump_sum: 300.00,
        vat_amount: 525.00,
        deductible_vat: 525.00,
        non_deductible_vat: 0.00,
        vat_exempt_region: 'No',
        note: 'This is a sample KUF document for demonstration purposes.',
        currency: '$',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T14:45:00Z'
    };

    const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf'


    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">

                    <CRow className="mb-4">

                    </CRow>

                    <CRow className="justify-content-center">

                        <CCol lg={4} className="mb-4">
                            <DocumentInfo data={mockKufData} type="kuf" />
                        </CCol>

                        <CCol lg={8} className="mb-4">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" />
                                        Document Viewer
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <PdfViewer pdfUrl={mockPdfUrl} />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default KufDetails;