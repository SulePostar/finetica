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

const Kuf = () => {
    const mockKufData = [
        {
            id: 1,
            invoiceNumber: "62320",
            type: "Invoice",
            customer: "—",
            invoiceDate: "08/09/2025",
            dueDate: "07/12/2025",
            totalAmount: "52969.00",
            review: "Rejected",
        },
        {
            id: 2,
            invoiceNumber: "22222",
            type: "Faktura",
            customer: "—",
            invoiceDate: "13/08/2025",
            dueDate: "12/09/2025",
            totalAmount: "714.39",
            review: "Approved",
        },
        {
            id: 3,
            invoiceNumber: "40405-0808064-14075",
            type: "Račun",
            customer: "—",
            invoiceDate: "15/07/2025",
            dueDate: "30/07/2025",
            totalAmount: "56.34",
            review: "Approved",
        },
        {
            id: 4,
            invoiceNumber: "8529",
            type: "Invoice",
            customer: "—",
            invoiceDate: "10/01/2025",
            dueDate: "24/01/2025",
            totalAmount: "67329.60",
            review: "Approved",
        },
        {
            id: 5,
            invoiceNumber: "12366-P1-1",
            type: "Račun",
            customer: "—",
            invoiceDate: "13/08/2025",
            dueDate: "—",
            totalAmount: "54.00",
            review: "Approved",
        },
        {
            id: 6,
            invoiceNumber: "250724225755",
            type: "Račun",
            customer: "—",
            invoiceDate: "31/07/2025",
            dueDate: "08/08/2025",
            totalAmount: "11.05",
            review: "Pending",
        },
        {
            id: 7,
            invoiceNumber: "347003",
            type: "INVOICE",
            customer: "—",
            invoiceDate: "29/03/2025",
            dueDate: "28/04/2025",
            totalAmount: "577271.99",
            review: "Pending",
        },
        {
            id: 8,
            invoiceNumber: "702016",
            type: "Invoice",
            customer: "—",
            invoiceDate: "08/04/2025",
            dueDate: "08/05/2025",
            totalAmount: "1106.06",
            review: "Pending",
        },
        {
            id: 9,
            invoiceNumber: "5324027835",
            type: "Invoice",
            customer: "—",
            invoiceDate: "31/07/2025",
            dueDate: "—",
            totalAmount: "0.06",
            review: "Pending",
        },
        {
            id: 10,
            invoiceNumber: "15997",
            type: "Invoice",
            customer: "—",
            invoiceDate: "26/11/2023",
            dueDate: "—",
            totalAmount: "97299.36",
            review: "Approved",
        },
    ];

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
                accessorKey: "type",
                header: "Type",
                cell: ({ row }) => row.original.type || "—",
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
                    const value = row.original.totalAmount;
                    return value ? `${value} KM` : "—";
                },
            },
            {
                accessorKey: "review",
                header: "Review",
                cell: ({ row }) => {
                    const value = row.original.review?.toLowerCase();

                    const statusStyles = {
                        approved: "bg-chart-2 text-primary-foreground",
                        pending: "bg-chart-4 text-primary-foreground",
                        rejected: "bg-destructive text-primary-foreground",
                        default: "bg-muted text-muted-foreground",
                    };

                    const color = statusStyles[value] || statusStyles.default;

                    return (
                        <Badge className={color}>
                            {row.original.review
                                ? row.original.review.charAt(0).toUpperCase() +
                                row.original.review.slice(1)
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

    return (
        <>
            <PageTitle text="KUF - Purchase Invoices" />
            <DynamicTable columns={getKufColumns((item) => console.log("Action on:", item))} data={mockKufData} />
        </>
    );
}
export default Kuf;