import { useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { PdfViewer } from '@/components/documentDetails/PdfViewer';
import DocumentInfo from '@/components/documentDetails/DocumentInfo';
import ActionButtons from '@/components/documentDetails/ActionButtons';
import { useDocument } from '@/hooks/use-document';
import DefaultLayout from '@/layout/DefaultLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Table } from 'lucide-react';

const DocumentDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const onSaveCallback = location.state?.onSave;

    const documentType = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/kif/')) return 'kif';
        if (path.includes('/kuf/')) return 'kuf';
        if (path.includes('/contracts/')) return 'contract';
        if (path.includes('/bank-transactions/')) return 'bank-transactions';
        if (path.includes('/partners/')) return 'partner';
        return null;
    }, [location.pathname]);

    const isApproveMode = location.pathname.includes('/approve');
    const isEditMode = location.pathname.includes('/edit');

    const {
        formData,
        setFormData,
        pdfUrl,
        loading,
        error,
        isEditing,
        isApproved,
        isSaved,
        handleApprove,
        handleSave,
        handleEdit,
        handleCancel,
    } = useDocument(documentType, id, onSaveCallback);

    const cardTitle = isEditMode
        ? 'Edit Document'
        : isApproveMode
            ? 'Approve Document'
            : `View ${documentType?.toUpperCase() || 'Document'} Details`;

    return (
        <DefaultLayout>
            <div className="container mx-auto p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left side - Document Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <DocumentInfo
                            data={formData}
                            type={documentType}
                            editable={((isApproveMode && isEditing) || (!isSaved && isEditMode))}
                            loading={loading}
                            error={error}
                            onChange={setFormData}
                            actions={
                                <ActionButtons
                                    isApproveMode={isApproveMode}
                                    isEditing={isEditing}
                                    isEditMode={isEditMode}
                                    isApproved={isApproved}
                                    handleSave={handleSave}
                                    handleCancel={handleCancel}
                                    handleApprove={handleApprove}
                                    handleEdit={handleEdit}
                                    documentType={documentType}
                                    isSaved={isSaved}
                                />
                            }
                        />

                        {/* Button to navigate to items page */}
                        {!loading && (documentType === 'kif' || documentType === 'kuf' || documentType === 'bank-transactions') && Array.isArray(formData?.items) && (
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => navigate(`/${documentType}/${id}/items`, { state: { backUrl: location.pathname } })}
                            >
                                <Table className="h-4 w-4" />
                                View Items Table
                            </Button>
                        )}
                    </div>

                    {/* Right side - PDF Viewer */}
                    <div className="lg:col-span-2">
                        <Card className="h-full shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-spurple">
                                    {cardTitle}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center space-y-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                            <p className="text-sm text-muted-foreground">Loading document...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="document-pdf">
                                        {pdfUrl ? (
                                            <PdfViewer pdfUrl={pdfUrl} />
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                No PDF available for this document.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default DocumentDetails;