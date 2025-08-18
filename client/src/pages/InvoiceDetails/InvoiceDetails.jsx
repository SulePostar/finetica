import { useParams, useLocation } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo/DocumentInfo';
import { createMockKifData, createMockKufData, createMockContractData } from '../../utilis/constants/InvoicesData';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';

const InvoiceDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    // determine type
    const getDocumentType = () => {
        if (location.pathname.includes('/kif/')) return 'kif';
        if (location.pathname.includes('/kuf/')) return 'kuf';
        if (location.pathname.includes('/contracts/')) return 'contract';
    };
    const documentType = getDocumentType();

    // determine mode (view or approve)
    const isApproveMode = location.pathname.includes('/approve');

    // mock data
    const getMockData = () => {
        switch (documentType) {
            case 'kif': return createMockKifData(id);
            case 'kuf': return createMockKufData(id);
            case 'contract': return createMockContractData(id);
            default: return null;
        }
    };
    const mockData = getMockData();
    const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 details-page">
                <CContainer fluid className="details-container">
                    <CRow className="justify-content-center">
                        <CCol lg={4} className="mb-4">
                            <DocumentInfo
                                data={mockData}
                                type={documentType}
                                actions={
                                    isApproveMode && (
                                        <>
                                            <CButton color="success">Approve</CButton>
                                            <CButton color="secondary">Reject</CButton>
                                        </>
                                    )
                                }
                            />
                        </CCol>

                        <CCol lg={8} className="mb-4">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                                        {isApproveMode
                                            ? 'Approval Viewer'
                                            : documentType === 'contract'
                                                ? 'Contract Viewer'
                                                : 'Document Viewer'}
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
