import { cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CRow } from '@coreui/react';
import { useLocation, useParams } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  createMockKifData,
  createMockKufData,
  createMockVatData,
} from '../../utilis/constants/InvoicesData';

const InvoiceDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  // Determine document type based on URL path
  let documentType;

  if (location.pathname.includes('/kif/')) {
    documentType = 'kif';
  } else if (location.pathname.includes('/kuf/')) {
    documentType = 'kuf';
  } else if (location.pathname.includes('/vat/')) {
    documentType = 'vat';
  }

  // Get appropriate mock data based on document type
  let mockData;

  if (documentType === 'kif') {
    mockData = createMockKifData(id);
  } else if (documentType === 'kuf') {
    mockData = createMockKufData(id);
  } else if (documentType === 'vat') {
    mockData = createMockVatData(id);
  }

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
