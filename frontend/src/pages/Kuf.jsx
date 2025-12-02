import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKufInvoices } from "@/queries/Kuf";
import { useState } from "react";

const Kuf = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, isPending } = useKufInvoices({ page, perPage });
    const formatDate = (date) => {
        if (!date) return "—";
        return new Intl.DateTimeFormat("en-GB").format(new Date(date));
    };

    function getKufColumns(onAction) {
        return [
            {
                accessorKey: "invoiceNumber",
                header: "Invoice Number",
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.invoiceNumber || "—"}
                    </span>
                ),
            },
            {
                accessorKey: "invoiceType",
                header: "Type",
                cell: ({ row }) => row.original.invoiceType || "—",
            },
            {
                accessorKey: "customer",
                header: "Customer",
                cell: ({ row }) => row.original.customer || "—",
            },
            {
                accessorKey: "invoiceDate",
                header: "Invoice Date",
                cell: ({ row }) => formatDate(row.original.invoiceDate),
            },
            {
                accessorKey: "dueDate",
                header: "Due Date",
                cell: ({ row }) => formatDate(row.original.dueDate),
            },
            {
                accessorKey: "totalAmount",
                header: "Total Amount",
                cell: ({ row }) => {
                    const value = row.original.netTotal;
                    return value ? `${value} KM` : "—";
                },
            },
            {
                accessorKey: "review",
                header: () => <span className="inline-flex items-center px-5.5 py-0.5">Review</span>,
                cell: ({ row }) => {
                    const approved = row.original.approvedAt || row.original.approvedBy;

                    const value = approved ? 'approved' : 'pending';

                    const statusStyles = {
                        approved: "bg-chart-2/60 font-bold border-chart-2",
                        pending: "bg-chart-4/60 dark:bg-chart-3/60 font-bold border-chart-4 dark:border-chart-3",
                        rejected: "bg-destructive/60 font-bold border-destructive",
                        default: "bg-muted/60 font-bold border-muted-foreground",
                    };

                    const color = statusStyles[value] || statusStyles.default;

                    return (
                        <Badge className={`${color} w-30 justify-center`}>
                            {value
                                ? value.charAt(0).toUpperCase() +
                                value.slice(1)
                                : "—"}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const item = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => onAction(item)}
                                >
                                    View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => console.log("Download", item)}
                                >
                                    Download
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ];
    }

    if (isPending) return <p>"Loading..."</p>
    return (
        <>
            <PageTitle text="KUF - Purchase Invoices" />
            <DynamicTable columns={getKufColumns((item) => console.log("Action on:", item))} data={data.data ? data.data : []} total={data?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </>
    );
}
export default Kuf;