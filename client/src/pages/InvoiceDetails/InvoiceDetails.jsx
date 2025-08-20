import { useParams, useLocation } from 'react-router-dom';
import DocumentInfo from '../../components/InfoCards/DocumentInfo/DocumentInfo';
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
  CButton,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';
import { useState, useEffect } from 'react';
import ContractService from '../../services/contract';

const InvoiceDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);


  const isApproveMode = location.pathname.includes('/approve');

  const computeApproved = (d) =>
    Boolean(d?.approvedAt || d?.approvedBy || d?.status === 'approved');


  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await ContractService.getById(id);
        setFormData(data);
        setPdfUrl(data.pdfUrl || 'https://pdfobject.com/pdf/sample.pdf');
        setIsApproved(computeApproved(data));
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Failed to load document';
        setError(msg);
        console.error('GET /contracts/:id failed:', msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);


  const handleApprove = async () => {
    try {
      const { data } = await ContractService.approve(id, formData);
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
    ContractService.getById(id)
      .then((res) => {
        setFormData(res.data);
        setIsApproved(computeApproved(res.data));
      })
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  const handleSave = async () => {
    try {
      const { data } = await ContractService.approve(id, formData);
      setFormData(data);
      setIsApproved(computeApproved(data));
      setIsEditing(false);
    } catch (err) {
      console.error('Save (approve) failed:', err?.response?.status, err?.response?.data || err.message);
    }
  };


  const documentType = 'contract';

  return (
    <DefaultLayout>
      <div className="body flex-grow-1 px-3 details-page">
        <CContainer fluid className="details-container">
          <CRow className="justify-content-center">
            <CCol lg={4} className="mb-4">
              {loading ? (
                <div className="text-center py-5"><CSpinner color="primary" /></div>
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
                            <CButton
                              color="success"
                              onClick={handleApprove}
                              disabled={isApproved}
                            >
                              {isApproved ? "Approved" : "Approve"}
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
                    {isApproveMode ? "Approve Document" : `View ${documentType.toUpperCase()} Details`}
                  </CCardTitle>
                </CCardHeader>
                <CCardBody>
                  {loading ? <CSpinner /> : <PdfViewer pdfUrl={pdfUrl} />}
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