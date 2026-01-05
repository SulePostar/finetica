import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";

export function getInvalidPdfsColumns() {
  return [
    {
      accessorKey: "filename",
      header: "File Name",
      cell: ({ row }) => row.original.filename || "—",
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => row.original.message || "—",
    },
    {
      id: "status",
      header: "Status",
      meta: { isComponent: true },
      cell: ({ row }) => {
        const status = row.original.approvedAt || row.original.approvedBy;
        const value = status ? "approved" : "rejected";

        return (
          <div className="flex items-center justify-center">
            <ReviewStatusBadge status={value} />
          </div>
        );
      },
    },
    {
      accessorKey: "isProcessed",
      header: "Processed",
      cell: ({ row }) => {
        const processed = row.original.isProcessed;
        const value = processed ? 'true' : 'false';

        return (
          <ReviewStatusBadge status={value} />
        );
      },
    },
    {
      accessorKey: "processedAt",
      header: "Processed At",
      cell: ({ row }) => {
        const ts = row.original?.processedAt ?? row.original?.processed_at;
        return ts ? new Date(ts).toLocaleString() : "—";
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const ts =
          row.original?.created_at ?? row.original?.createdAt ?? row.original?.updated_at;
        return ts ? new Date(ts).toLocaleString() : "—";
      },
    },
  ];
}
