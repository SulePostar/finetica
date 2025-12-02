import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function getRolesStatusesColumns(type = "roles", onDelete, nameKey) {
    return [
        {
            id: "index",
            header: () => <div className="text-center w-full">Row</div>,
            cell: ({ row }) => (
                <div className="text-center w-full">
                    {row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: nameKey,
            header: () => (
                <div className="text-center w-full">
                    {type === "roles" ? "Role" : "Status"}
                </div>
            ),
            cell: ({ row }) => {
                const value = row.original[nameKey];

                if (type === "statuses") {
                    const statusStyles = {
                        approved: "bg-chart-2 text-primary-foreground",
                        pending: "bg-chart-4 text-primary-foreground",
                        rejected: "bg-destructive text-primary-foreground",
                        default: "bg-muted text-muted-foreground",
                    };

                    const key = value?.toLowerCase() || "None";
                    const color = statusStyles[key] || statusStyles.default;

                    return (
                        <div className="flex justify-center w-full">
                            <Badge className={color}>
                                {value?.charAt(0).toUpperCase() + value?.slice(1)}
                            </Badge>
                        </div>
                    );
                }

                return (
                    <div className="flex justify-center w-full font-medium">
                        {value}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center w-full">Actions</div>,
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex justify-center w-full">
                        <Button
                            variant="destructive"
                            onClick={() => onDelete(item)}
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];
}
