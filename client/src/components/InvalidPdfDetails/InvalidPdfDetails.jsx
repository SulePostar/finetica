import { useEffect, useState } from "react";
import {
    CSpinner,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CFormInput,
    CFormSelect,
    CButton,
    CListGroup,
    CListGroupItem,
    CCardText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import { PdfViewer } from "../PdfViewer/PdfViewer";

const InvalidPdfDetails = ({ id, type }) => {
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                let endpoint = "";
                switch (type) {
                    case 1:
                        endpoint = `${API_BASE}/bank-transactions/${id}`;
                        break;
                    case 2:
                    case 3:
                        endpoint = `${API_BASE}/kif-kuf/${id}`;
                        break;
                    case 4:
                        endpoint = `${API_BASE}/contracts/${id}`;
                        break;
                    default:
                        console.error("Unknown document type");
                        return;
                }
                const res = await fetch(endpoint);
                if (!res.ok) throw new Error("Document not found");
                const data = await res.json();
                setDoc(data);
                setFormData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [id, type, API_BASE]);

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
            console.log("Deleting document:", doc.filename);
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
        return <div className="text-danger text-center">Document not found</div>;
    }

    return (
        <CRow className="g-0">
            {/* PDF Viewer */}
            <CCol md={8} className="border-end bg-light d-flex align-items-center justify-content-center">
                {doc.pdfUrl ? <PdfViewer pdfUrl={doc.pdfUrl} /> : <div>No PDF available</div>}
            </CCol>
            {/* Document Info Panel */}
            <CCol md={4} className="bg-white">
                <CCard className="border-0 shadow-sm rounded-3">
                    <CCardHeader className="d-flex justify-content-center align-items-center bg-white border-bottom">
                        <div className="d-flex gap-2">
                            {isEditing ? (
                                <>
                                    <CButton color="success" size="sm" onClick={handleSave}>
                                        Save
                                    </CButton>
                                    <CButton color="secondary" size="sm" onClick={handleCancel}>
                                        Cancel
                                    </CButton>
                                </>
                            ) : (
                                <>
                                    <CButton color="secondary" size="sm" onClick={handleEdit}>
                                        <CIcon icon={cilPencil} className="me-1" />
                                        Edit
                                    </CButton>
                                    <CButton color="danger" size="sm" onClick={handleDelete}>
                                        <CIcon icon={cilTrash} className="me-1" />
                                        Delete
                                    </CButton>
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, filename: e.target.value })
                                        }
                                    />
                                ) : (
                                    doc.filename
                                )}
                            </CListGroupItem>

                            {/* Message */}
                            <CListGroupItem>
                                <small className="text-muted d-block">Message</small>
                                {isEditing ? (
                                    <CFormInput
                                        value={formData.message || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                    />
                                ) : (
                                    doc.message || "-"
                                )}
                            </CListGroupItem>

                            {/* Status */}
                            <CListGroupItem>
                                <small className="text-muted d-block">Status</small>
                                {isEditing ? (
                                    <CFormSelect
                                        value={formData.isValid ? "valid" : "invalid"}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isValid: e.target.value === "valid",
                                            })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isProcessed: e.target.value === "yes",
                                            })
                                        }
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
                                {doc.processedAt
                                    ? new Date(doc.processedAt).toLocaleString()
                                    : "-"}
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
