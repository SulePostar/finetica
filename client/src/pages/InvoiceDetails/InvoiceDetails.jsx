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
  CSpinner,
} from '@coreui/react';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import ContractService from '../../services/contract';
import KifService from '../../services/kif';
import {
  createMockKifData,
  createMockKufData,
  createMockVatData,
} from '../../utilis/constants/InvoicesData';

const InvoiceDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  // Determine document type based on URL path
  const getDocumentType = () => {
    if (location.pathname.includes('/kif/')) return 'kif';
    if (location.pathname.includes('/kuf/')) return 'kuf';
    if (location.pathname.includes('/contracts/')) return 'contract';
    if (location.pathname.includes('/vat/')) return 'vat';
  };

  const documentType = getDocumentType();

  // Get appropriate mock data based on document type
  const getMockData = () => {
    switch (documentType) {
      case 'kif':
        return createMockKifData(id);
      case 'kuf':
        return createMockKufData(id);
      case 'vat':
        return createMockVatData(id);
    }
  };

  const mockData = getMockData();

  // For now hardcoded, this will come from an API call
  const mockPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';
  const [formData, setFormData] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const isApproveMode = location.pathname.includes('/approve');

  const computeApproved = (d) =>
    Boolean(d?.approvedAt || d?.approvedBy || d?.status === 'approved');

  const fetchDocument = async (id, setFormData, setPdfUrl, setIsApproved, setLoading, setError) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (documentType === 'contract') {
        const response = await ContractService.getById(id);
        data = response.data;
      } else if (documentType === 'kif') {
        const response = await KifService.getById(id);
        data = response.data;
      } else {
        // For KUF and VAT, use mock data for now
        data = mockData;
      }

      setFormData(data);
      setPdfUrl(data.pdfUrl || 'https://pdfobject.com/pdf/sample.pdf');
      setIsApproved(computeApproved(data));
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load document';
      setError(msg);
      console.error(`GET /${documentType}s/:id failed:`, msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDocument(id, setFormData, setPdfUrl, setIsApproved, setLoading, setError);
  }, [id]);

  const handleApprove = async () => {
    try {
      let data;
      if (documentType === 'contract') {
        const response = await ContractService.approve(id, formData);
        data = response.data;
      } else if (documentType === 'kif') {
        const response = await KifService.approve(id, formData);
        data = response.data;
      } else {
        // For KUF and VAT, use mock approval for now
        data = { ...formData, approvedAt: new Date().toISOString() };
      }

      setFormData(data);
      setIsApproved(computeApproved(data));
    } catch (err) {
      console.error('Approve failed:', err?.response?.status, err?.response?.data || err.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let data;
        if (documentType === 'contract') {
          const response = await ContractService.getById(id);
          data = response.data;
        } else if (documentType === 'kif') {
          const response = await KifService.getById(id);
          data = response.data;
        } else {
          // For KUF and VAT, use mock data for now
          data = mockData;
        }

        setFormData(data);
        setIsApproved(computeApproved(data));
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const handleSave = async () => {
    try {
      let data;
      if (documentType === 'contract') {
        const response = await ContractService.approve(id, formData);
        data = response.data;
      } else if (documentType === 'kif') {
        const response = await KifService.approve(id, formData);
        data = response.data;
      } else {
        // For KUF and VAT, use mock approval for now
        data = { ...formData, approvedAt: new Date().toISOString() };
      }

      setFormData(data);
      setIsApproved(computeApproved(data));
      setIsEditing(false);
    } catch (err) {
      console.error(
        'Save (approve) failed:',
        err?.response?.status,
        err?.response?.data || err.message
      );
    }
  };

  return (
    <DefaultLayout>
      <div className="body flex-grow-1 px-3 details-page">
        <CContainer fluid className="details-container">
          <CRow className="justify-content-center">
            <CCol lg={4} className="mb-4">
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <DocumentInfo
                  data={formData}
                  type={documentType}
                  editable={isApproveMode && isEditing}
                  loading={loading}
                  error={error}
                  onChange={setFormData}
                  actions={
                    isApproveMode ? (
                      <>
                        {!isEditing ? (
                          <div className="w-100 d-flex justify-content-center mt-3 gap-2">
                            <CButton color="success" onClick={handleApprove} disabled={isApproved}>
                              {isApproved ? 'Approved' : 'Approve'}
                            </CButton>
                            {!isApproved && (
                              <CButton color="secondary" onClick={handleEdit}>
                                Edit
                              </CButton>
                            )}
                          </div>
                        ) : (
                          <div className="w-100 d-flex justify-content-center mt-3 gap-2">
                            <CButton color="primary" onClick={handleSave}>
                              Save
                            </CButton>
                            <CButton color="danger" onClick={handleCancel}>
                              Cancel
                            </CButton>
                          </div>
                        )}
                      </>
                    ) : undefined
                  }
                />
              )}
            </CCol>

            <CCol lg={8} className="mb-4">
              <CCard className="h-100 shadow-sm detail-card">
                <CCardHeader>
                  <CCardTitle className="mb-0">
                    <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                    {isApproveMode
                      ? 'Approve Document'
                      : `View ${documentType.toUpperCase()} Details`}
                  </CCardTitle>
                </CCardHeader>
                <CCardBody>{loading ? <CSpinner /> : <PdfViewer pdfUrl={pdfUrl} />}</CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </DefaultLayout>
  );
};

export default InvoiceDetails;
