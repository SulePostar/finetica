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
import { useParams, useLocation } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo';
import { createMockKifData, createMockKufData } from '../../utilis/constants/InvoicesData';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';

const InvoiceDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    // Determine document type based on URL path
    const documentType = location.pathname.includes('/kif/') ? 'kif' : 'kuf';

    // Get appropriate mock data based on document type
    const mockData = documentType === 'kif'
        ? createMockKifData(id)
        : createMockKufData(id);

    // For now hardcoded, this will come from an API call
    const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">
                    <CRow className="justify-content-center">
                        <CCol lg={4} className="mb-4">
                            <DocumentInfo data={mockData} type={documentType} />
                        </CCol>

                        <CCol lg={8} className="mb-4">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
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

export default InvoiceDetails;
