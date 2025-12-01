import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList } from "@/queries/KifQueries";
import { Badge } from "@/components/ui/Badge";

export const columns = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice Number',
        cell: info => info.getValue() || '—',
    },
    {
        accessorKey: 'invoiceType',
        header: 'Type',
        cell: info => info.getValue() || '—',
    },
    {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: info => info.getValue() || '—',
    },
    {
        accessorKey: 'invoiceDate',
        header: 'Invoice Date',
        cell: info => {
            const value = info.getValue();
            return value ? new Date(value).toLocaleDateString() : '—';
        },
    },
    {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: info => {
            const value = info.getValue();
            return value ? new Date(value).toLocaleDateString() : '—';
        },
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: info => {
            const value = info.getValue();
            return value != null ? `${parseFloat(value).toFixed(2)} KM` : '—';
        },
    },
    {
        accessorKey: 'status',
        header: 'Review',
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
];

const Kif = () => {
    const { data: response, isLoading, isError, error } = useKifList();

    if (isLoading) {
        return (
            <>
                <PageTitle text="Kif" />
                <div>Loading...</div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageTitle text="Kif" />
                <div>Error: {error.message}</div>
            </>
        );
    }

    return (
        <>
            <PageTitle text="Kif" />
            <DynamicTable columns={columns} data={response?.data || []} />
        </>
    );
};

export default Kif;