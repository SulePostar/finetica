import { formatMoney } from "@/helpers/numberFormats";
import {
    getKifQuantity,
    getKifNet,
    getKifGross,
} from "@/helpers/documentItemsHelpers";

const formatQuantity = (value) => {
    if (value == null) return "—";
    return value;
};

export const getKifItemsColumns = () => [
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
        cell: ({ row }) => formatQuantity(getKifQuantity(row.original)),
    },
    {
        header: "Unit Price",
        accessorKey: "unitPrice",
        cell: ({ row }) => formatMoney(row.original.unitPrice),
    },
    {
        header: "Net Subtotal",
        accessorKey: "netSubtotal",
        cell: ({ row }) => formatMoney(getKifNet(row.original)),
    },
    {
        header: "VAT Amount",
        accessorKey: "vatAmount",
        cell: ({ row }) => formatMoney(row.original.vatAmount),
    },
    {
        header: "Gross Subtotal",
        accessorKey: "grossSubtotal",
        cell: ({ row }) => formatMoney(getKifGross(row.original)),
    },
];
