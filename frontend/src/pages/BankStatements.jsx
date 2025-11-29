import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useBankTransactions } from "@/queries/BankStatementsPage";
import { Badge } from "@/components/ui/badge";

const bankStatementsColumns = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = row.original.date;
            return date ? new Date(date).toLocaleDateString() : '—';
        }
    },
    {
        accessorKey: "TransactionCategory.name",
        header: "Category",
        cell: ({ row }) => row.original.TransactionCategory?.name || '—'
    },
    {
        accessorKey: "accountNumber",
        header: "Account Number",
        cell: ({ row }) => row.original.accountNumber || '—'
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || '—'
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = row.original.amount;
            return amount ? `${parseFloat(amount).toFixed(2)}` : '—';
        }
    },
    {
        accessorKey: "approvedAt",
        header: "Status",
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

const BankStatements = () => {
    const { data, isPending, isError, error } = useBankTransactions();

    if (isPending) {
        return (
            <div>
                <p className="mt-4 text-sm text-muted-foreground">Loading bank statements...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <PageTitle text="Bank Statements" subtitle="Bank Statements" />
                <p className="mt-4 text-sm text-red-600">
                    Error while loading bank statements: {error.message}
                </p>
            </div>
        );
    }

    const rows = data?.data ?? [];

    return (
        <div>
            <PageTitle text="Bank Statements" />
            <DynamicTable columns={bankStatementsColumns} data={rows} />
        </div>
    );
}

export default BankStatements;