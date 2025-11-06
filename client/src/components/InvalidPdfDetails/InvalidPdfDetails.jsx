import { useEffect, useRef, useState } from "react";
import {
  CSpinner, CRow, CCol, CCard, CCardBody, CCardHeader, CBadge,
  CListGroup, CListGroupItem, CCardText,
} from "@coreui/react";
import { PdfViewer } from "../PdfViewer/PdfViewer";
import api from "../../services/api";
import AppButton from "../AppButton/AppButton";
import ConfirmationModal from "../Modals/ConfirmationModal/ConfirmationModal";
import '../../pages/invalidPdfs/InvalidPdfs.css';

const TYPE_TO_PATH = {
  1: "transactions",
  2: "kif",
  3: "kuf",
  4: "contracts",
};

const InvalidPdfDetails = ({ id, type, onDeleted }) => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // EDIT LOGIKA ZAKOMENTARISANA
  // const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({});

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const reqSeqRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
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
          // setFormData(data);   // EDIT LOGIKA ZAKOMENTARISANA
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

  useEffect(() => {
    const handler = () =>
      setIsDarkMode(document.documentElement.getAttribute('data-coreui-theme') === 'dark');
    window.document.documentElement.addEventListener('ColorSchemeChange', handler);
    return () =>
      window.document.documentElement.removeEventListener('ColorSchemeChange', handler);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!doc) return;
    setDeleting(true);
    setDeleteMessage(null);

    try {
      const base = TYPE_TO_PATH[type];
      await api.delete(`/${base}/logs/${encodeURIComponent(id)}`);

      setDeleteMessage("Document successfully deleted.");
      setDoc(null);

      // refresh the table and close the modal
      if (onDeleted) onDeleted(id);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteMessage("Failed to delete document.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center text-danger p-5">
        {deleteMessage ? deleteMessage : "Document not found"}
      </div>
    );
  }

  return (
    <>
      <CRow>
        {/* LEFT: PDF Viewer */}
        <CCol md={8} className="d-flex align-items-center justify-content-center">
          {doc.pdfUrl ? <PdfViewer pdfUrl={doc.pdfUrl} /> : <div>No PDF available</div>}
        </CCol>

        {/* RIGHT: Details panel */}
        <CCol md={4} className={isDarkMode ? "bg-dark text-light" : "bg-white"}>
          <CCard
            className="border-0 shadow rounded-3"
            style={isDarkMode ? { backgroundColor: '#22262e' } : { backgroundColor: '#fff' }}
          >

            <CCardBody className="mt-2">
              <CCardText className={isDarkMode ? "text-light h3" : "text-dark h3"}>
                Document Information
              </CCardText>

              <CListGroup flush>
                {/* File Name */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>File Name</small>
                  {doc.filename}
                </CListGroupItem>

                {/* Message */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>Message</small>
                  {doc.message || "-"}
                </CListGroupItem>

                {/* Status */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>Status</small>
                  {doc.isValid ? (
                    <CBadge color="success">Valid</CBadge>
                  ) : (
                    <CBadge color="danger">Invalid</CBadge>
                  )}
                </CListGroupItem>

                {/* Processed */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>Processed</small>
                  {doc.isProcessed ? (
                    <CBadge color="success">Yes</CBadge>
                  ) : (
                    <CBadge color="danger">No</CBadge>
                  )}
                </CListGroupItem>

                {/* Processed At */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>Processed At</small>
                  {doc.processedAt ? new Date(doc.processedAt).toLocaleString() : "-"}
                </CListGroupItem>

                {/* Created At */}
                <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
                  <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>Created At</small>
                  {new Date(doc.createdAt).toLocaleString()}
                </CListGroupItem>
              </CListGroup>

              {/* DELETE button */}
              <div className="d-flex justify-content-center mt-4">
                <AppButton
                  variant="danger"
                  size="md"
                  onClick={() => setShowConfirm(true)}
                  disabled={deleting}
                  icon="mdi:trash"
                  iconClassName="me-1"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AppButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Confirmation modal */}
      <ConfirmationModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        body={
          <p className="mb-0">
            Are you sure you want to permanently delete <strong>{doc.filename}</strong>? This action cannot be undone.
          </p>
        }
        confirmText="Delete"
        confirmColor="danger"
        loading={deleting}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export { InvalidPdfDetails };
