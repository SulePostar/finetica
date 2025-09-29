import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import AppButton from '../AppButton/AppButton';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const PdfViewer = ({ pdfUrl }) => {
    if (!pdfUrl || typeof pdfUrl !== 'string' || pdfUrl.trim() === '' || pdfUrl === 'null') {
        return <div>No PDF available for this transaction.</div>;
    }

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const changePage = (offset) => setPageNumber((prev) => prev + offset);
    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    return (
        <div className="overflow-hidden">

            {/* PDF Display */}
            <div className="d-flex justify-content-center border rounded bg-light overflow-auto">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="p-5 text-center">Loading PDF...</div>}
                >
                    {/* Set width to 100% so it fits container, maxWidth limits to desktop size */}
                    <Page
                        pageNumber={pageNumber}
                        width={Math.min(window.innerWidth * 0.95, 800)}
                    />
                </Document>
            </div>
            {/* Controls */}
            <div className="d-flex justify-content-center align-items-center py-2 flex-wrap">
                <AppButton
                    variant="secondary"
                    size="sm"
                    className="mx-1 my-1"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    &larr; Previous
                </AppButton>
                <span className="fw-bold mx-3 my-1">
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </span>
                <AppButton
                    variant="secondary"
                    size="sm"
                    className="mx-1 my-1"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next &rarr;
                </AppButton>
            </div>
        </div>
    );
};
