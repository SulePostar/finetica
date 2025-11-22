import { Badge } from "@/components/ui/badge";

export function getRolesPermissionsColumns(type = "roles", onDelete) {
    return [
        {
            id: "index",
            header: "No",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: type === "roles" ? "Role" : "Permission",
            cell: ({ row }) => {
                const value = row.original.name;

                if (type === "permissions") {
                    // Odredi boju badge-a na osnovu statusa
                    let color;
                    switch (value.toLowerCase()) {
                        case "approved":
                            color = "bg-green-500 text-white";
                            break;
                        case "pending":
                            color = "bg-yellow-500 text-black";
                            break;
                        case "rejected":
                            color = "bg-red-500 text-white";
                            break;
                        default:
                            color = "bg-gray-300 text-black";
                    }

                    return (<Badge className={color}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge>);
                }

                // Ako je role → običan tekst
                return <span className="font-medium">{value}</span>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <button
                        className="text-red-600 hover:underline"
                        onClick={() => onDelete(item)}
                    >
                        Delete
                    </button>
                );
            },
        },
    ];
}
