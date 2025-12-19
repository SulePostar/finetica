import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { Button } from "@/components/ui/button";
import ConfirmDeleteModal from "@/components/shared-ui/modals/ConfirmDeleteModal";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";

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

                return <div className="flex justify-center w-full font-medium">{capitalizeFirst(value)}</div>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center w-full">Actions</div>,
            meta: { isComponent: true },
            cell: ({ row }) => {
                const item = row.original;

                const isProtectedRole =
                    type === "roles" && [1, 2].includes(Number(item.id));

                const label = item[nameKey] ?? "this item";

                return (
                    <div className="flex justify-center w-full">
                        <ConfirmDeleteModal
                            disabled={isProtectedRole}
                            title={`Delete "${label}"?`}
                            description={`This will permanently delete "${label}". This action cannot be undone.`}
                            onConfirm={() => onDelete(item)}
                            trigger={<Button variant="destructive">Delete</Button>}
                        />
                    </div>
                );
            },
        },
    ];
}
