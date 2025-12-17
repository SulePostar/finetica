import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentFetcher } from '@/hooks/use-document';
import { PdfViewer } from '@/components/shared-ui/PdfViewer';
import PageTitle from '@/components/shared-ui/PageTitle';
import { Spinner } from '@/components/ui/spinner';
import IsError from '@/components/shared-ui/IsError';
import DefaultLayout from '@/layout/DefaultLayout';
import { DocumentFields } from '@/components/document-details/DocumentFields';
const DocumentDetails = () => {

    const { type, id } = useParams();
    const navigate = useNavigate();

    const {
        data: document,
        isPending,
        isError,
        error,
        refetch
    } = useDocumentFetcher(type, id);

    if (isError) {
        return (
            <DefaultLayout>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Document Details"
                    showDetails={true}
                />
            </DefaultLayout>
        );
    }
    if (isPending) {
        return <DefaultLayout>
            <PageTitle text="Document Details" />
            <div className="flex items-center justify-center h-40">
                <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
            </div>
        </DefaultLayout>;
    }

    return (
        <DefaultLayout>
            <PageTitle text="Document Details" />
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Document Fields Section */}
                    <div className="order-1 lg:order-1">
                        <DocumentFields document={document} />
                    </div>

                    {/* PDF Viewer Section */}
                    <div className="order-2 lg:order-2">
                        <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
                        <PdfViewer pdfUrl={document.pdfUrl} />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};
export default DocumentDetails;









