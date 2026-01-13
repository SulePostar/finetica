import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDocumentFetcher } from '@/hooks/use-document';
import { PdfViewer } from '@/components/shared-ui/PdfViewer';
import PageTitle from '@/components/shared-ui/PageTitle';
import { Spinner } from '@/components/ui/spinner';
import IsError from '@/components/shared-ui/IsError';
import { DocumentFields } from '@/components/document-details/DocumentFields';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const DocumentDetails = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const documentType = location.pathname.split('/')[1]; // Gets 'kuf', 'kif', 'bank-statements', or 'contracts'


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
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                <div className="order-1 lg:order-1 min-w-0 flex flex-col">
                    <DocumentFields document={data} type={documentType} />
                    {documentType !== "contracts" && (<Button onClick={() => navigate(`/${documentType}/${id}/items`, { state: { backUrl: location.pathname } })} className="mt-4 w-full bg-[var(--spurple)] text-md">View Item Details</Button>)}
                </div>

                <div className="order-2 lg:order-2  min-w-0">
                    <PdfViewer pdfUrl={data.pdfUrl} />
                </div>
            </div>
        </div>
    );
};
export default DocumentDetails;
