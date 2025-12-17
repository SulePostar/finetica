import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentFetcher } from '@/hooks/use-document';
import { PdfViewer } from '@/components/shared-ui/PdfViewer';
const DocumentDetails = () => {

    const { type, id } = useParams();
    const navigate = useNavigate();

    const {
        data: document,
        isLoading,
        isError,
        error
    } = useDocumentFetcher(type, id);

    if (isLoading) {
        return <div className="p-10 text-center">Učitavanje dokumenta...</div>;
    }
    if (isError) {
        return (
            <div className="p-10 text-red-500">
                Došlo je do greške: {error.message}
            </div>
        );
    }
    if (!document) {
        return <div>Dokument nije pronađen.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <PdfViewer pdfUrl={document.pdfUrl} />
            </div>
        </div>
    );
};
export default DocumentDetails;









