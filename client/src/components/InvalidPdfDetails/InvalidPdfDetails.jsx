import { useEffect, useRef, useState } from "react";
import {
  CSpinner, CRow, CCol, CCard, CCardBody, CCardHeader, CBadge,
  CListGroup, CListGroupItem, CCardText,
} from "@coreui/react";
import { PdfViewer } from "../PdfViewer/PdfViewer";
import api from "../../services/api";
import AppButton from "../AppButton/AppButton";
import '../../pages/invalidPdfs/InvalidPdfs.css'

const TYPE_TO_PATH = {
  1: "transactions",
  2: "kif",
  3: "kuf",
  4: "contracts",
};

const InvalidPdfDetails = ({ id, type }) => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // EDIT LOGIKA ZAKOMENTARISANA
  // const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({});

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

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

  // EDIT LOGIKA ZAKOMENTARISANA
  // const handleEdit = () => setIsEditing(true);
  // const handleCancel = () => { setFormData(doc); setIsEditing(false); };
  // const handleSave = () => { setDoc(formData); setIsEditing(false); };

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
          <CCardHeader className="d-flex justify-content-center align-items-center border-none bg-transparent">
            {/* Uklonjen Edit/Save/Cancel, ostavljen samo Delete */}
            <AppButton
              variant="danger"
              size="md"
              onClick={handleDelete}
              icon='mdi:trash'
              iconClassName="me-1"
            >
              Delete
            </AppButton>
          </CCardHeader>

          <CCardBody className="mt-3">
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export { InvalidPdfDetails };
