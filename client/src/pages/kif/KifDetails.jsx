import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';
import { useParams } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import '../../components/InfoCards/DocumentInfo.styles.css';

const KifDetails = () => {
    const { id } = useParams();

    const mockKifData = {
        id: id || '1',
        documentNumber: 'KIF-2024-001',
        invoice_number: 'SINV-2024-001',
        bill_number: 'SBILL-2024-001',
        customer_name: 'Sample Customer Ltd.',
        customer_id: '987654321',
        vat_period: '2024-01',
        invoice_type: 'Standard',
        invoice_date: '2024-01-15',
        due_date: '2024-02-15',
        delivery_period: '2024-01-20',
        total_amount: 4500.00,
        vat_category: 'Standard Rate',
        note: 'This is a sample KIF document for demonstration purposes.',
        currency: '$',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T14:45:00Z'
    };

    const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">

                    <CRow className="mb-4">

                    </CRow>

                    <CRow className="justify-content-center">

                        <CCol lg={4} className="mb-4">
                            <DocumentInfo data={mockKifData} type="kif" />
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

export default KifDetails;
