import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useContracts } from "../queries/useContracts";
import { Badge } from "@/components/ui/badge";

const dummyContracts = [
  {
    id: 1,
    partner_name: "Acme Corp",
    contract_number: "CTR-2024-001",
    contract_type: "Service Agreement",
    start_date: "2024-01-15",
    end_date: "2025-01-15",
    amount: 12000,
    is_active: true
  },
  {
    id: 2,
    partner_name: "Globex Inc",
    contract_number: "CTR-2024-002",
    contract_type: "License Agreement",
    start_date: "2024-02-01",
    end_date: "2025-02-01",
    amount: 8000,
    is_active: false
  },
  {
    id: 3,
    partner_name: "Soylent Co",
    contract_number: "CTR-2024-003",
    contract_type: "Maintenance Contract",
    start_date: "2024-03-10",
    end_date: "2025-03-10",
    amount: 15000,
    is_active: false
  },
];

const contractColumns = [
  {
    accessorKey: "partner_name",
    header: "Partner",
    cell: ({ row }) => row.original.partner_name || row.original.businessPartner?.name || "—"
  },
  {
    accessorKey: "contract_number",
    header: "Contract Number",
    cell: ({ row }) => row.original.contract_number || row.original.contractNumber || "—"
  },
  {
    accessorKey: "contract_type",
    header: "Type",
    cell: ({ row }) => row.original.contract_type || row.original.contractType || "—"
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.original.start_date || row.original.startDate;
      return date ? new Date(date).toLocaleDateString() : "—";
    }
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.original.end_date || row.original.endDate;
      return date ? new Date(date).toLocaleDateString() : "—";
    }
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active ?? row.original.isActive ?? false;
      const statusStyles = {
        active: "bg-chart-2 text-primary-foreground",
        inactive: "bg-muted text-muted-foreground",
      };
      const status = isActive ? "active" : "inactive";
      const color = statusStyles[status];
      return <Badge className={color}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return amount ? `${parseFloat(amount).toFixed(2)}` : "—";
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