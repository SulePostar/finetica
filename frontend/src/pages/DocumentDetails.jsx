import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDocumentFetcher } from "@/hooks/use-document";
import { PdfViewer } from "@/components/shared-ui/PdfViewer";
import PageTitle from "@/components/shared-ui/PageTitle";
import { Spinner } from "@/components/ui/spinner";
import IsError from "@/components/shared-ui/IsError";
import { DocumentFields } from "@/components/document-details/DocumentFields";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DocumentDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const documentType = location.pathname.split("/")[1]; // 'kuf', 'kif', 'bank-statements', 'contracts'
    const isApproveMode = location.pathname.includes("/approve");

    const { data, isPending, isError, error, refetch } = useDocumentFetcher(documentType, id);

    if (isPending) {
        return (
            <>
                <PageTitle text="Document Details" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
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
            {/* Top-left back button */}
            <div className="mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex text-[var(--spurple)] items-center gap-2"
                    onClick={() => navigate(location.state?.backUrl || `/${documentType}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {documentType.replace(/-/g, " ")}
                </Button>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                {/* Left: fields + actions */}
                <div className="min-w-0 flex flex-col">
                    <DocumentFields
                        document={data}
                        type={documentType}
                        actions={
                            isApproveMode ? (
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-600/90 text-white"
                                        onClick={() => console.log("APPROVE", documentType, id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-[var(--spurple)] border-[var(--spurple)] hover:bg-[var(--spurple)]/10"
                                        onClick={() => console.log("EDIT", documentType, id)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            ) : null
                        }
                    />

                    {documentType !== "contracts" && (
                        <Button
                            onClick={() =>
                                navigate(`/${documentType}/${id}/items`, {
                                    state: { backUrl: location.pathname },
                                })
                            }
                            className="mt-4 w-full bg-[var(--spurple)] text-md"
                        >
                            View Item Details
                        </Button>
                    )}
                </div>

                <div className="min-w-0 min-h-[calc(100vh-64px)]">
                    <PdfViewer pdfUrl={data.pdfUrl} />
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;
