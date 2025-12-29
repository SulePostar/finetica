import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useDocumentItems } from "@/queries/documentItems";

// helperi iz starog koda
const n2 = (v) =>
    v == null || v === "" ? null : Number(String(v).replace(",", "."));
const r2 = (v) =>
    v == null || Number.isNaN(v)
        ? null
        : Math.round((v + Number.EPSILON) * 100) / 100;

const DocumentItemsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // pagination state
    const [page, setPage] = useState(1);
    const perPage = 10;

    // reset page kad promijeniš dokument ili path
    useEffect(() => {
        setPage(1);
    }, [id, location.pathname]);

    const rawSegment = location.pathname.split("/")[1];

    // mapiranje URL → backend documentType
    const documentType = useMemo(() => {
        const path = location.pathname;

        if (rawSegment === "kif" || rawSegment === "kuf") {
            return rawSegment;
        }

        if (rawSegment === "bank-statements") return "bank-transactions";
        if (rawSegment === "bank-transactions") return "bank-transactions";

        if (path.includes("/kif/")) return "kif";
        if (path.includes("/kuf/")) return "kuf";
        if (path.includes("/bank-transactions/") || path.includes("/bank-statements/")) {
            return "bank-transactions";
        }

        return null;
    }, [location.pathname, rawSegment]);

    const state = location.state || {};
    const backUrl = state.backUrl || `/${rawSegment}/${id}`;

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

    // helperi za prikaz KIF vrijednosti
    const renderKifQuantity = (row) => {
        const q = n2(row.quantity);
        const p = n2(row.unitPrice);
        const net = n2(row.netSubtotal);
        if (q != null) return q;
        if (p != null && (net != null || net == null)) return 1;
        return "—";
    };

    const renderKifNet = (row) => {
        const net = n2(row.netSubtotal);
        if (net != null) return net;
        const q = n2(row.quantity);
        const p = n2(row.unitPrice);
        if (p == null) return "—";
        const effQ = q != null ? q : 1;
        return r2(effQ * p);
    };

    const renderKifGross = (row) => {
        const gross = n2(row.grossSubtotal);
        if (gross != null) return gross;
        const net = n2(row.netSubtotal);
        if (net != null) return net;
        const q = n2(row.quantity);
        const p = n2(row.unitPrice);
        if (p == null) return "—";
        const effQ = q != null ? q : 1;
        return r2(effQ * p);
    };

    // kolone za DynamicTable
    const columns = useMemo(() => {
        if (!documentType) return [];

        if (documentType === "kif") {
            return [
                {
                    header: "ID",
                    accessorKey: "id",
                },
                {
                    header: "Order #",
                    accessorKey: "orderNumber",
                    cell: ({ row }) => row.original.orderNumber ?? "—",
                },
                {
                    header: "Description",
                    accessorKey: "description",
                    cell: ({ row }) => row.original.description ?? "—",
                },
                {
                    header: "Unit",
                    accessorKey: "unit",
                    cell: ({ row }) => row.original.unit ?? "—",
                },
                {
                    header: "Quantity",
                    accessorKey: "quantity",
                    cell: ({ row }) => renderKifQuantity(row.original),
                },
                {
                    header: "Unit Price",
                    accessorKey: "unitPrice",
                    cell: ({ row }) =>
                        row.original.unitPrice != null ? row.original.unitPrice : "—",
                },
                {
                    header: "Net Subtotal",
                    accessorKey: "netSubtotal",
                    cell: ({ row }) => renderKifNet(row.original),
                },
                {
                    header: "VAT Amount",
                    accessorKey: "vatAmount",
                    cell: ({ row }) =>
                        row.original.vatAmount != null ? row.original.vatAmount : "—",
                },
                {
                    header: "Gross Subtotal",
                    accessorKey: "grossSubtotal",
                    cell: ({ row }) => renderKifGross(row.original),
                },
            ];
        }

        if (documentType === "kuf") {
            return [
                {
                    header: "ID",
                    accessorKey: "id",
                },
                {
                    header: "Order #",
                    accessorKey: "orderNumber",
                    cell: ({ row }) => row.original.orderNumber ?? "—",
                },
                {
                    header: "Description",
                    accessorKey: "description",
                    cell: ({ row }) => row.original.description ?? "—",
                },
                {
                    header: "Net Subtotal",
                    accessorKey: "netSubtotal",
                    cell: ({ row }) =>
                        row.original.netSubtotal != null
                            ? row.original.netSubtotal
                            : "—",
                },
                {
                    header: "Lump Sum",
                    accessorKey: "lumpSum",
                    cell: ({ row }) =>
                        row.original.lumpSum != null ? row.original.lumpSum : "—",
                },
                {
                    header: "VAT Amount",
                    accessorKey: "vatAmount",
                    cell: ({ row }) =>
                        row.original.vatAmount != null ? row.original.vatAmount : "—",
                },
                {
                    header: "Gross Subtotal",
                    accessorKey: "grossSubtotal",
                    cell: ({ row }) =>
                        row.original.grossSubtotal != null
                            ? row.original.grossSubtotal
                            : "—",
                },
            ];
        }

        // bank-transactions
        return [
            {
                header: "Date",
                accessorKey: "date",
                cell: ({ row }) =>
                    row.original.date
                        ? new Date(row.original.date).toLocaleDateString()
                        : "—",
            },
            {
                header: "Description",
                accessorKey: "description",
                cell: ({ row }) => row.original.description ?? "—",
            },
            {
                header: "Amount",
                accessorKey: "amount",
                cell: ({ row }) =>
                    row.original.amount != null ? row.original.amount : "—",
            },
            {
                header: "Bank Name",
                accessorKey: "bankName",
                cell: ({ row }) => row.original.bankName ?? "—",
            },
            {
                header: "Account Number",
                accessorKey: "accountNumber",
                cell: ({ row }) => row.original.accountNumber ?? "—",
            },
            {
                header: "Direction",
                accessorKey: "direction",
                cell: ({ row }) => row.original.direction ?? "—",
            },
        ];
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
                <PageTitle text="Document Items" />
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
                            text="Document Items"
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
