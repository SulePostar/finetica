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
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import DocumentInfo from '../../components/InfoCards/DocumentInfo/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import DefaultLayout from '../../layout/DefaultLayout';
import { useDocument } from "../../hooks/useDocuments"

const DocumentDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const documentType = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/kif/')) return 'kif';
    if (path.includes('/kuf/')) return 'kuf';
    if (path.includes('/contracts/')) return 'contract';
    if (path.includes('/bank-transactions/')) return 'bank-transactions';
    return null;
  }, [location.pathname]);

  const isApproveMode = location.pathname.includes('/approve');

  const {
    formData,
    setFormData,
    pdfUrl,
    loading,
    error,
    isEditing,
    isApproved,
    handleApprove,
    handleSave,
    handleEdit,
    handleCancel,
  } = useDocument(documentType, id);

  const renderActionButtons = () => {
    if (!isApproveMode) return null;

    if (isEditing) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <CButton color="primary" onClick={handleSave}>Save</CButton>
          <CButton color="danger" onClick={handleCancel}>Cancel</CButton>
        </div>
      );
    }

    return (
      <div className="w-100 d-flex justify-content-center mt-3 gap-2">
        <CButton color="success" onClick={handleApprove} disabled={isApproved}>
          {isApproved ? 'Approved' : 'Approve'}
        </CButton>
        {!isApproved && (
          <CButton color="secondary" onClick={handleEdit}>Edit</CButton>
        )}
      </div>
    );
  };

  const cardTitle = isApproveMode
    ? 'Approve Document'
    : `View ${documentType?.toUpperCase() || 'Document'} Details`;

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
                  actions={renderActionButtons()}
                />
              )}
            </CCol>
            <CCol lg={8} className="mb-4">
              <CCard className="h-100 shadow-sm detail-card">
                <CCardHeader>
                  <CCardTitle className="mb-0">
                    <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                    {cardTitle}
                  </CCardTitle>
                </CCardHeader>
                <CCardBody>
                  {loading ? (
                    <div className="text-center py-5">
                      <CSpinner color="primary" />
                    </div>
                  ) : (
                    <PdfViewer pdfUrl={pdfUrl} />
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </DefaultLayout>
  );
};

export default DocumentDetails;