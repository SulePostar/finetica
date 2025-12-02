import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useContracts } from "../queries/useContracts";
import { Badge } from "@/components/ui/badge";

const dummyContracts = [
  { id: 1, name: "Contract A", customer_name: "Acme Corp", amount: 12000, status: "active" },
  { id: 2, name: "Contract B", customer_name: "Globex Inc", amount: 8000, status: "pending" },
  { id: 3, name: "Contract C", customer_name: "Soylent Co", amount: 15000, status: "canceled" },
  { id: 4, name: "Contract D", customer_name: "Initech", amount: 5000, status: "active" },
  { id: 5, name: "Contract E", customer_name: "Umbrella Corp", amount: 20000, status: "pending" },
  { id: 6, name: "Contract F", customer_name: "Hooli", amount: 11000, status: "active" },
  { id: 7, name: "Contract G", customer_name: "Vehement Capital Partners", amount: 9500, status: "canceled" },
  { id: 8, name: "Contract H", customer_name: "Massive Dynamic", amount: 13000, status: "active" }
];

const contractColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Contract Name" },
  { accessorKey: "customer_name", header: "Customer" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => row.original.amount ? parseFloat(row.original.amount).toFixed(2) : "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.original.status ?? "pending";
      const statusStyles = {
        active: "bg-chart-2 text-primary-foreground",
        pending: "bg-chart-4 text-primary-foreground",
        canceled: "bg-destructive text-primary-foreground",
        default: "bg-muted text-muted-foreground",
      };
      const color = statusStyles[value] || statusStyles.default;
      return <Badge className={color}>{value}</Badge>;
    },
  },
];

export default function Contracts() {
  const { data, isPending, isError, error } = useContracts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allRows = data?.data ?? dummyContracts;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = allRows.slice(startIndex, endIndex);

  if (isPending) {
    return <p className="mt-4 text-sm text-muted-foreground">Loading contracts...</p>;
  }

  if (isError) {
    return (
      <div>
        <PageTitle text="Contracts" />
        <p className="mt-4 text-sm text-red-600">Error while loading contracts: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <PageTitle text="Contracts" />
      <DynamicTable
        columns={contractColumns}
        data={paginatedRows}
        total={allRows.length}
        page={currentPage}
        perPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}