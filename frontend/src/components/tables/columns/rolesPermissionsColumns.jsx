import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function getRolesPermissionsColumns(type = "roles", onDelete) {
    return [
        {
            id: "index",
            header: "Row",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: type === "roles" ? "Role" : "Permission",
            cell: ({ row }) => {
                const value = row.original.name;

                if (type === "permissions") {
                    const statusStyles = {
                        approved: "bg-chart-2 text-primary-foreground",
                        pending: "bg-chart-4 text-primary-foreground",
                        rejected: "bg-destructive text-primary-foreground",
                        default: "bg-muted text-muted-foreground",
                    };

                    const key = value.toLowerCase();
                    const color = statusStyles[key] || statusStyles.default;

                    return (<Badge className={color}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge>);
                }

                return <span className="font-medium">{value}</span>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <Button
                        variant="destructive" onClick={() => onDelete(item)}
                    >
                        Delete
                    </Button>
                );
            },
        },
    ];
}
