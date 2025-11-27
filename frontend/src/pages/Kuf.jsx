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

const Kuf = () => {


    const { data, isPending } = useKufInvoices();

    console.log("data", data);
    console.log(data);
    console.log(isPending);


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
                cell: ({ row }) => row.original.invoiceDate || "—",
            },
            {
                accessorKey: "dueDate",
                header: "Due Date",
                cell: ({ row }) => row.original.dueDate || "—",
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
                header: "Review",
                cell: ({ row }) => {
                    const approved = row.original.approvedAt || row.original.approvedBy;

                    const value = approved ? 'approved' : 'pending';

                    const statusStyles = {
                        approved: "bg-chart-2 text-primary-foreground",
                        pending: "bg-chart-4 text-primary-foreground",
                        rejected: "bg-destructive text-primary-foreground",
                        default: "bg-muted text-muted-foreground",
                    };

                    const color = statusStyles[value] || statusStyles.default;

                    return (
                        <Badge className={color}>
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
            <DynamicTable columns={getKufColumns((item) => console.log("Action on:", item))} data={data.data} />
        </>
    );
}
export default Kuf;