import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { Button } from "@/components/ui/button";

export function getRolesStatusesColumns(type = "roles", onDelete, nameKey) {
    return [

        {
            accessorKey: nameKey,
            header: () => (
                <div className="text-center w-full">
                    {type === "roles" ? "Role" : "Status"}
                </div>
            ),
            meta: { isComponent: true },
            cell: ({ row }) => {
                const value = row.original[nameKey];

                if (type === "statuses") {
                    return (
                        <div className="flex justify-center w-full">
                            <ReviewStatusBadge status={value} />
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
            meta: { isComponent: true },
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
