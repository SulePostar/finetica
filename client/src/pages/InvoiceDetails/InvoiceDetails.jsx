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

const MOCK_MODE = true; // switch to false when backend is ready

const InvoiceDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    const [isEditing, setIsEditing] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    // Determine document type
    const getDocumentType = () => {
        if (location.pathname.includes('/kif/')) return 'kif';
        if (location.pathname.includes('/kuf/')) return 'kuf';
        if (location.pathname.includes('/contracts/')) return 'contract';
        return 'kuf';
    };
    const documentType = getDocumentType();

    // Determine mode (view or approve)
    const isApproveMode = location.pathname.includes('/approve');

    // Fetch document data
    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            setError(null);

            try {
                if (MOCK_MODE) {
                    // 🔹 Mock response
                    const data = {
                        id,
                        title: "Sample Document",
                        type: documentType,
                        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
                        createdBy: "Mock User",
                        createdAt: new Date().toISOString(),
                    };
                    await new Promise(r => setTimeout(r, 500));
                    setFormData(data);
                    setPdfUrl(data.pdfUrl);
                } else {
                    // 🔹 Real API call
                    const res = await fetch(`/api/documents/${id}`);
                    if (!res.ok) throw new Error('Failed to fetch document');

                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await res.json();
                        setFormData(data);
                        setPdfUrl(data.pdfUrl || 'https://pdfobject.com/pdf/sample.pdf');
                    } else {
                        throw new Error("Expected JSON but got " + contentType);
                    }
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id, documentType]);

    // Handlers
    const handleApprove = async () => {
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 500));
                setIsApproved(true);
                return;
            }

            const payload = {
                status: "approved",
                approvedAt: new Date().toISOString(),
                approvedBy: "Current User", // replace with logged-in user info
            };

            const response = await fetch(`/api/documents/${id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Approval failed");
            setIsApproved(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 500));
                setIsEditing(false);
                return;
            }

            const response = await fetch(`/api/documents/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Save failed");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setLoading(true);
        setError(null);

        if (MOCK_MODE) {
            const data = {
                id,
                title: "Sample Document",
                type: documentType,
                pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
            };
            setFormData(data);
            setPdfUrl(data.pdfUrl);
            setLoading(false);
        } else {
            fetch(`/api/documents/${id}`)
                .then(res => res.json())
                .then(data => setFormData(data))
                .finally(() => setLoading(false));
        }
    };

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
                                    editable={isEditing}
                                    loading={loading}
                                    error={error}
                                    onChange={setFormData}
                                    actions={
                                        isApproveMode && (
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
                                        )
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
                                            ? "Approve Document"
                                            : `View ${documentType.toUpperCase()} Details`}
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
