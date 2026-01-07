import { formatMoney } from "@/helpers/numberFormats";

export const getKufItemsColumns = () => [
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
        cell: ({ row }) => formatMoney(row.original.netSubtotal),
    },
    {
        header: "Lump Sum",
        accessorKey: "lumpSum",
        cell: ({ row }) => formatMoney(row.original.lumpSum),
    },
    {
        header: "VAT Amount",
        accessorKey: "vatAmount",
        cell: ({ row }) => formatMoney(row.original.vatAmount),
    },
    {
        header: "Gross Subtotal",
        accessorKey: "grossSubtotal",
        cell: ({ row }) => formatMoney(row.original.grossSubtotal),
    },
];
