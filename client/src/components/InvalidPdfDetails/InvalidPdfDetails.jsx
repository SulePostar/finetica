import { useState, useEffect } from 'react';
import {
  CSpinner, CRow, CCol, CCard, CCardBody, CCardText,
} from '@coreui/react';
import { PdfViewer } from "../PdfViewer/PdfViewer";
import { useInvalidPdfDocument } from './useInvalidPdfDocument';
import { DocumentInformation } from './DocumentInformation';
import { DocumentActions } from './DocumentActions';
import '../../pages/invalidPdfs/InvalidPdfs.css';

const InvalidPdfDetails = ({ id, type }) => {
  const { doc, loading, setDoc } = useInvalidPdfDocument(id, type);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  useEffect(() => {
    const handler = () =>
      setIsDarkMode(document.documentElement.getAttribute('data-coreui-theme') === 'dark');
    window.document.documentElement.addEventListener('ColorSchemeChange', handler);
    return () =>
      window.document.documentElement.removeEventListener('ColorSchemeChange', handler);
  }, []);

  useEffect(() => {
    if (doc) {
      setFormData(doc);
    }
  }, [doc]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData(doc);
    setIsEditing(false);
  };
  const handleSave = () => {
    setDoc(formData);
    setIsEditing(false);
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      console.log("Deleting document:", doc?.filename);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!doc) return <div className="text-danger text-center">Document not found</div>;

  return (
    <CRow>
      <CCol md={8} className="d-flex align-items-center justify-content-center">
        {doc.pdfUrl ? <PdfViewer pdfUrl={doc.pdfUrl} /> : <div>No PDF available</div>}
      </CCol>

      <CCol md={4} className={isDarkMode ? "bg-dark text-light" : "bg-white"}>
        <CCard
          className="border-0 shadow rounded-3"
          style={isDarkMode ? { backgroundColor: '#22262e' } : { backgroundColor: '#fff' }}
        >
          <DocumentActions
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />

          <CCardBody className="mt-3">
            <CCardText className={isDarkMode ? "text-light h3" : "text-dark h3"}>
              Document Information
            </CCardText>
            <DocumentInformation
              doc={doc}
              isEditing={isEditing}
              formData={formData}
              setFormData={setFormData}
              isDarkMode={isDarkMode}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export { InvalidPdfDetails };
