import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useDocumentItems } from "@/queries/documentItems";

import { useDocumentType } from "@/hooks/use-document-types";

import { getKifItemsColumns } from "@/components/tables/columns/kifItemsColumns";
import { getKufItemsColumns } from "@/components/tables/columns/kufItemsColumns";
import { getBankTransactionItemsColumns } from "@/components/tables/columns/bankTransactionItemsColumns";

const DocumentItemsPage = () => {
    const { id, documentType: rawDocumentType } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const documentType = useDocumentType(rawDocumentType);

    // pagination
    const [page, setPage] = useState(1);
    const perPage = 10;

    // reset page on document or path change
    useEffect(() => {
        setPage(1);
    }, [id, location.pathname]);

    const pageTitle = useMemo(() => {
        if (!documentType) return "Document Items";

        if (documentType === "kif") return "KIF Items";
        if (documentType === "kuf") return "KUF Items";
        if (documentType === "bank-transactions") return "Bank Transaction Items";

        return "Document Items";
    }, [documentType]);

    const state = location.state || {};
    const backUrl =
        state.backUrl || (rawDocumentType && id ? `/${rawDocumentType}/${id}` : "/");

    const {
        data: items = [],
        isPending,
        isError,
        error,
        refetch,
    } = useDocumentItems(documentType || undefined, id);

    // client-side pagination
    const total = items.length;

    const paginatedRows = useMemo(() => {
        if (!items || items.length === 0) return [];
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    }, [items, page, perPage]);

    const columns = useMemo(() => {
        if (!documentType) return [];

        if (documentType === "kif") return getKifItemsColumns();
        if (documentType === "kuf") return getKufItemsColumns();
        if (documentType === "bank-transactions")
            return getBankTransactionItemsColumns();

        return [];
    }, [documentType]);

    if (!documentType) {
        return (
            <>
                <PageTitle text="Document Items" />
                <p className="mt-4 text-red-500">
                    Unable to determine document type from URL.
                </p>
            </>
        );
    }

    if (isPending) {
        return (
            <>
                <PageTitle text={pageTitle} />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <div>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load document items"
                    showDetails={true}
                />
            </div>
        );
    }

    return (
        <div className="pt-20 space-y-6">
            <DynamicTable
                header={
                    <div className="flex items-center justify-between w-full">
                        <PageTitle
                            text={pageTitle}
                            subtitle="Details of document items"
                            compact
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(backUrl)}
                            >
                                ← Back to document
                            </Button>
                        </div>
                    </div>
                }
                columns={columns}
                data={paginatedRows}
                total={total}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </div>
    );
};

export default DocumentItemsPage;
