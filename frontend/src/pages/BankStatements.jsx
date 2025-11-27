import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useBankTransactions } from "@/queries/BankStatementsPage";

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
            const approvedAt = row.original.approvedAt;
            if (approvedAt) {
                return (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Approved
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    Pending
                </span>
            );
        }
    },
];

const BankStatements = () => {
    const { data, isLoading, isError, error } = useBankTransactions();

    if (isLoading) {
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