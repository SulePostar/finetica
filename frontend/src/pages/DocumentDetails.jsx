import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDocumentFetcher } from '@/hooks/use-document';
import { PdfViewer } from '@/components/shared-ui/PdfViewer';
import PageTitle from '@/components/shared-ui/PageTitle';
import { Spinner } from '@/components/ui/spinner';
import IsError from '@/components/shared-ui/IsError';
import { DocumentFields } from '@/components/document-details/DocumentFields';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DocumentDetails = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const documentType = location.pathname.split('/')[1]; // Gets 'kuf', 'kif', 'bank-statements', or 'contracts'
    const isApproveMode = location.pathname.includes("/approve");

    const {
        data,
        isPending,
        isError,
        error,
        refetch
    } = useDocumentFetcher(documentType, id);
    if (isPending) {
        return <><PageTitle text="Document Details" />
            <div className="flex items-center justify-center h-40">
                <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
            </div></>;
    }
    if (isError) {
        return (
            <IsError
                error={error}
                onRetry={() => refetch()}
                title="Failed to load document details"
                showDetails={true}
            />
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)]">
            <div className="container mx-auto p-6 pb-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex text-[var(--spurple)] items-center gap-2"
                    onClick={() =>
                        navigate(location.state?.backUrl || `/${documentType}`)
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {documentType.replace("-", " ")}
                </Button>
            </div>


            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                    <div className="order-1 lg:order-1 min-w-0">
                        <DocumentFields document={data} type={documentType} />

                        {isApproveMode && (
                            <div className="mt-6 flex gap-3">
                                <Button className="flex-1 bg-emerald-600 text-white">
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 text-[var(--spurple)] border-[var(--spurple)]"
                                >
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="order-2 lg:order-2 min-w-0">
                        <PdfViewer pdfUrl={data.pdfUrl} />
                    </div>
                </div>
            </div>
        </div>
    );

};
export default DocumentDetails;
