import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


export const PdfViewer = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <div className="shadow-sm border rounded">

            <div className="d-flex justify-content-center bg-light">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="p-5">Loading PDF...</div>}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>

            <div className="d-flex justify-content-center align-items-center py-2">

                <button
                    type="button"
                    className="btn btn-secondary btn-sm mx-1"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    &larr; Previous
                </button>


                <span className="fw-bold mx-3">
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </span>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm mx-1"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    )
};