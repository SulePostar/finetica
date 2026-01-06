import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    useBankTransactionById,
    useBankTransactionUpdate,
} from "@/queries/BankTransactionsQueries";
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

    const documentType = location.pathname.split("/")[1];
    const isApproveMode = location.pathname.includes("/approve");

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    // never allow edit outside approve mode
    useEffect(() => {
        if (!isApproveMode) setIsEditing(false);
    }, [isApproveMode]);

    const {
        data,
        isPending,
        isError,
        error,
        refetch,
    } = useBankTransactionById(id);

    const updateMutation = useBankTransactionUpdate(id);

    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    if (isPending) {
        return (
            <>
                <PageTitle text="Document Details" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <IsError
                error={error}
                onRetry={refetch}
                title="Failed to load document details"
                showDetails
            />
        );
    }

    const ALLOWED_KEYS = [
        "date",
        "amount",
        "accountNumber",
        "description",
        "direction",
        "fileName",
        "invoiceId",
        "partnerId",
        "categoryId",
    ];

    const buildDirtyPayload = (original, edited) => {
        const out = {};
        for (const key of ALLOWED_KEYS) {
            const a = original?.[key];
            const b = edited?.[key];

            if (JSON.stringify(a) !== JSON.stringify(b) && b !== undefined) {
                out[key] = b;
            }
        }
        return out;
    };

    const handleSave = async () => {
        const payload = buildDirtyPayload(data, formData);
        await updateMutation.mutateAsync(payload);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(data);
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Back button */}
            <div className="mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex text-[var(--spurple)] items-center gap-2"
                    onClick={() =>
                        navigate(location.state?.backUrl || `/${documentType}`)
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {documentType.replace(/-/g, " ")}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                {/* Left */}
                <div className="min-w-0 flex flex-col">
                    <DocumentFields
                        document={isEditing ? formData : data}
                        type={documentType}
                        editable={isEditing}
                        onChange={setFormData}
                        actions={
                            isEditing ? (
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-[var(--spurple)] text-white"
                                        disabled={updateMutation.isPending}
                                        onClick={handleSave}
                                    >
                                        {updateMutation.isPending ? "Saving..." : "Save"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex-1 text-[var(--spurple)] border-[var(--spurple)]"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : isApproveMode ? (
                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-emerald-600 text-white">
                                        Approve
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex-1 text-[var(--spurple)] border-[var(--spurple)]"
                                        onClick={() => setIsEditing(true)}
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
                            className="mt-4 w-full bg-[var(--spurple)] text-white"
                        >
                            View Item Details
                        </Button>
                    )}
                </div>

                {/* Right */}
                <div className="min-w-0 min-h-[calc(100vh-64px)]">
                    <PdfViewer pdfUrl={data?.pdfUrl} />
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;
