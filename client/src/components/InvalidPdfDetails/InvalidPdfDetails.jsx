import React, { useEffect, useState } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilSave, cilX } from "@coreui/icons";

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
        // Normally call PUT/PATCH API
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
            <div className="d-flex justify-content-center align-items-center h-100">
                <CSpinner color="primary" />
            </div>
        );
    }

    if (!doc) {
        return <div className="text-danger text-center">Document not found</div>;
    }

    return (
        <CRow className="h-100 g-0">
            {/* PDF Viewer */}
            <CCol md={8} className="border-end">
                <embed
                    src={`${API_BASE}/files/${doc.filename}`}
                    type="application/pdf"
                    className="w-100 h-100"
                />
            </CCol>

            {/* Document Info Panel */}
            <CCol md={4} className="p-3">
                <CCard className="h-100 shadow-sm">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">{doc.filename}</span>
                        <div className="d-flex gap-2">
                            {isEditing ? (
                                <>
                                    <CButton
                                        color="success"
                                        size="sm"
                                        onClick={handleSave}
                                        title="Save"
                                    >
                                        <CIcon icon={cilSave} />
                                    </CButton>
                                    <CButton
                                        color="secondary"
                                        size="sm"
                                        onClick={handleCancel}
                                        title="Cancel"
                                    >
                                        <CIcon icon={cilX} />
                                    </CButton>
                                </>
                            ) : (
                                <>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        onClick={handleEdit}
                                        title="Edit"
                                    >
                                        <CIcon icon={cilPencil} />
                                    </CButton>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={handleDelete}
                                        title="Delete"
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </>
                            )}
                        </div>
                    </CCardHeader>

                    <CCardBody className="p-0">
                        <CListGroup flush>
                            <CListGroupItem>
                                <span className="fw-bold me-2">Description:</span>
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

                            <CListGroupItem>
                                <span className="fw-bold me-2">Category:</span>
                                {isEditing ? (
                                    <CFormInput
                                        value={formData.category || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                    />
                                ) : (
                                    doc.category || "-"
                                )}
                            </CListGroupItem>

                            <CListGroupItem>
                                <span className="fw-bold me-2">Status:</span>
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

                            <CListGroupItem>
                                <span className="fw-bold me-2">Upload Date:</span>
                                {new Date(doc.createdAt).toLocaleDateString()}
                            </CListGroupItem>

                            <CListGroupItem>
                                <span className="fw-bold me-2">File Size:</span>
                                {doc.size || "-"}
                            </CListGroupItem>

                            <CListGroupItem>
                                <span className="fw-bold me-2">Tags:</span>
                                {isEditing ? (
                                    <CFormInput
                                        value={formData.tags?.join(", ") || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tags: e.target.value.split(",").map((t) => t.trim()),
                                            })
                                        }
                                        placeholder="Enter tags, separated by commas"
                                    />
                                ) : (
                                    doc.tags?.map((t, i) => (
                                        <CBadge
                                            key={i}
                                            color="secondary"
                                            className="me-1 text-dark bg-light"
                                        >
                                            {t}
                                        </CBadge>
                                    ))
                                )}
                            </CListGroupItem>
                        </CListGroup>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export { InvalidPdfDetails };
