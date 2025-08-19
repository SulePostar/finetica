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

const MOCK_MODE = true;

const InvoiceDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    const [formData, setFormData] = useState({});
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    // Determine document type
    const documentType = (() => {
        if (location.pathname.includes('/kif/')) return 'kif';
        if (location.pathname.includes('/kuf/')) return 'kuf';
        if (location.pathname.includes('/contracts/')) return 'contract';
        return 'kuf';
    })();

    // Determine mode
    const isApproveMode = location.pathname.includes('/approve');

    // Fetch document data
    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            setError(null);
            try {
                if (MOCK_MODE) {
                    const mockData = {
                        id,
                        title: "Sample Document",
                        type: documentType,
                        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
                        createdBy: "Mock User",
                        createdAt: new Date().toISOString(),
                    };
                    await new Promise(r => setTimeout(r, 500));
                    setFormData(mockData);
                    setPdfUrl(mockData.pdfUrl);
                } else {
                    const res = await fetch(`/api/contracts/${id}`);
                    if (!res.ok) throw new Error('Failed to fetch document');

                    const data = await res.json();
                    setFormData(data);
                    setPdfUrl(data.pdfUrl || 'https://pdfobject.com/pdf/sample.pdf');
                }
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id, documentType]);

    // Handlers
    const handleApprove = async () => {
        if (MOCK_MODE) {
            setIsApproved(true);
            return;
        }
        try {
            const payload = {
                status: "approved",
                approvedAt: new Date().toISOString(),
                approvedBy: "Current User",
            };
            const res = await fetch(`/api/contracts/${id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Approval failed");
            setIsApproved(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setLoading(true);
        setError(null);
        if (MOCK_MODE) {
            setFormData({
                id,
                title: "Sample Document",
                type: documentType,
                pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
            });
            setPdfUrl("https://pdfobject.com/pdf/sample.pdf");
            setLoading(false);
        } else {
            fetch(`/api/contracts/${id}`)
                .then(res => res.json())
                .then(data => setFormData(data))
                .finally(() => setLoading(false));
        }
    };

    const handleSave = async () => {
        if (MOCK_MODE) {
            setIsEditing(false);
            return;
        }
        try {
            const res = await fetch(`/api/contracts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Save failed");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
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
