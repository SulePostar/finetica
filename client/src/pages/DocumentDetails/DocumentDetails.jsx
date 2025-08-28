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

import ActionButtons from '../../components/ActionButtons/ActionButtons';
import DocumentInfo from '../../components/InfoCards/DocumentInfo/DocumentInfo';
import { PdfViewer } from '../../components/PdfViewer/PdfViewer';
import { useDocument } from '../../hooks/useDocuments';
import DefaultLayout from '../../layout/DefaultLayout';

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

  <ActionButtons
    isApproveMode={isApproveMode}
    isEditing={isEditing}
    isApproved={isApproved}
    handleSave={handleSave}
    handleCancel={handleCancel}
    handleApprove={handleApprove}
    handleEdit={handleEdit}
  />;

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
                  actions={
                    <ActionButtons
                      isApproveMode={isApproveMode}
                      isEditing={isEditing}
                      isApproved={isApproved}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                      handleEdit={handleEdit}
                    />
                  }
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
