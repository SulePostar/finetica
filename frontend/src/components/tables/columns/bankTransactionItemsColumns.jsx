import { formatMoney } from "@/helpers/numberFormats";

export const getBankTransactionItemsColumns = () => [
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
        cell: ({ row }) => formatMoney(row.original.amount),
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
