import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Loader2, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Spinner } from '../ui/spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewer = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setContainerWidth(Math.min(entries[0].contentRect.width, 800));
            }
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);
    if (!pdfUrl || typeof pdfUrl !== 'string' || pdfUrl.trim() === '' || pdfUrl === 'null') {
        return (
            <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                <FileWarning className="h-8 w-8" />
                <p>There is no available PDF for this transaction.</p>
            </div>
        );
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };
    const changePage = (offset) => setPageNumber((prev) => prev + offset);
    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-spurple">Document Preview</CardTitle>
                <CardDescription>Original digital copy of the document</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex w-full flex-col gap-4">
                    <div ref={containerRef} className="d-flex justify-content-center border rounded bg-light overflow-auto">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <>
                                    <div className="flex items-center justify-center h-[100vh]">
                                        <Spinner className="w-7 h-7 sm:w-7 sm:h-17 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                                    </div>
                                </>
                            }
                            error={
                                <div className="flex h-[400px] items-center justify-center text-red-500">
                                </div>
                            }
                            className="flex justify-center"
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={containerWidth || 300}
                                className="shadow-lg"
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </Document>
                    </div>
                    {
                        numPages && (
                            <div className="flex items-center justify-center gap-4 py-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={previousPage}
                                    disabled={pageNumber <= 1}
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium">
                                    Page <span className="font-bold">{pageNumber}</span> of {numPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={nextPage}
                                    disabled={pageNumber >= numPages}
                                >
                                    Next
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        )
                    }
                </div >
            </CardContent>
        </Card>
    );
};