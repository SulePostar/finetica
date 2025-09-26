import { useEffect, useRef, useState } from "react";
import {
  CSpinner, CRow, CCol, CCard, CCardBody, CCardHeader, CBadge,
  CFormInput, CFormSelect, CListGroup, CListGroupItem, CCardText,
} from "@coreui/react";
import { PdfViewer } from "../PdfViewer/PdfViewer";
import api from "../../services/api";
import AppButton from "../AppButton/AppButton";

const TYPE_TO_PATH = {
  1: "transactions",
  2: "kif",
  3: "kuf",
  4: "contracts",
};

const InvalidPdfDetails = ({ id, type }) => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const reqSeqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!id || !type) return;

    const load = async () => {
      const mySeq = ++reqSeqRef.current;
      setLoading(true);
      try {
        const base = TYPE_TO_PATH[type];
        if (!base) throw new Error(`Unknown document type: ${type}`);

        const { data } = await api.get(`/${base}/logs/${encodeURIComponent(id)}`);

        if (mountedRef.current && mySeq === reqSeqRef.current) {
          setDoc(data);
          setFormData(data);
        }
      } catch (err) {
        if (mountedRef.current && mySeq === reqSeqRef.current) {
          console.error(err);
          setDoc(null);
        }
      } finally {
        if (mountedRef.current && mySeq === reqSeqRef.current) {
          setLoading(false);
        }
      }
    };

    load();
  }, [id, type]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setFormData(doc); setIsEditing(false); };
  const handleSave = () => { setDoc(formData); setIsEditing(false); };
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
    <CRow className="g-0 invalid-pdfs-container">
      {/* PDF Viewer */}
      <CCol md={8} className="border-end d-flex align-items-center justify-content-center pdf-viewer-container">
        {doc.pdfUrl ? <PdfViewer pdfUrl={doc.pdfUrl} /> : <div>No PDF available</div>}
      </CCol>

      {/* Details panel */}
      <CCol md={4} className="invalid-pdf-details-panel">
        <CCard className="border-0 shadow-sm rounded-3 h-100">
          <CCardHeader className="d-flex justify-content-center align-items-center border-bottom">
            <div className="d-flex gap-2">
              {isEditing ? (
                <>
                  <AppButton variant="primary" size="sm">Save</AppButton>
                  <AppButton variant="no-hover" size="sm" onClick={handleCancel}>Cancel</AppButton>
                </>
              ) : (
                <>
                  <AppButton variant="edit" size="sm" onClick={handleEdit} icon='mdi:pencil' iconClassName="me-1">Edit</AppButton>
                  <AppButton variant="danger" size="sm" onClick={handleDelete} icon='mdi:trash' iconClassName="me-1">Delete</AppButton>
                </>
              )}
            </div>
          </CCardHeader>

          <CCardBody>
            <CCardText className="mb-2 text-muted">Document Information</CCardText>
            <CListGroup flush>
              {/* File Name */}
              <CListGroupItem>
                <small className="text-muted d-block">File Name</small>
                {isEditing ? (
                  <CFormInput
                    value={formData.filename || ""}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                  />
                ) : (doc.filename)}
              </CListGroupItem>

              {/* Message */}
              <CListGroupItem>
                <small className="text-muted d-block">Message</small>
                {isEditing ? (
                  <CFormInput
                    value={formData.message || ""}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                ) : (doc.message || "-")}
              </CListGroupItem>

              {/* Status */}
              <CListGroupItem>
                <small className="text-muted d-block">Status</small>
                {isEditing ? (
                  <CFormSelect
                    value={formData.isValid ? "valid" : "invalid"}
                    onChange={(e) => setFormData({ ...formData, isValid: e.target.value === "valid" })}
                  >
                    <option value="valid">Valid</option>
                    <option value="invalid">Invalid</option>
                  </CFormSelect>
                ) : doc.isValid ? (
                  <CBadge color="success">Valid</CBadge>
                ) : (
                  <CBadge color="danger">Invalid</CBadge>
                )}
              </CListGroupItem>

              {/* Processed */}
              <CListGroupItem>
                <small className="text-muted d-block">Processed</small>
                {isEditing ? (
                  <CFormSelect
                    value={formData.isProcessed ? "yes" : "no"}
                    onChange={(e) => setFormData({ ...formData, isProcessed: e.target.value === "yes" })}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </CFormSelect>
                ) : doc.isProcessed ? (
                  <CBadge color="success">Yes</CBadge>
                ) : (
                  <CBadge color="danger">No</CBadge>
                )}
              </CListGroupItem>

              {/* Processed At */}
              <CListGroupItem>
                <small className="text-muted d-block">Processed At</small>
                {doc.processedAt ? new Date(doc.processedAt).toLocaleString() : "-"}
              </CListGroupItem>

              {/* Created At */}
              <CListGroupItem>
                <small className="text-muted d-block">Created At</small>
                {new Date(doc.createdAt).toLocaleString()}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export { InvalidPdfDetails };
