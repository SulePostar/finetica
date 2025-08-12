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
import { createMockKifData } from '../../utilis/constants/InvoicesData';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import '../../components/InfoCards/DocumentInfo.styles.css';

const KifDetails = () => {
    const { id } = useParams();

    // For now hardcoded, this will come from an API call
    const mockKifData = createMockKifData(id);
    const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">
                    <CRow className="justify-content-center">
                        <CCol lg={4} className="mb-4">
                            <DocumentInfo data={mockKifData} type="kif" />
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

export default KifDetails;
