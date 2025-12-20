import { ReviewStatusBadge } from "@/components/shared-ui/ReviewStatusBadge";
import { Button } from "@/components/ui/button";
import ConfirmDeleteModal from "@/components/shared-ui/modals/ConfirmDeleteModal";

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

                return <div className="flex justify-center w-full font-medium">{value}</div>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center w-full">Actions</div>,
            meta: { isComponent: true },
            cell: ({ row }) => {
                const item = row.original;
                const PROTECTED_IDS = {
                    roles: [1, 2],
                    statuses: [1, 2, 3],
                };
                const isProtected = PROTECTED_IDS[type]?.includes(Number(item.id));

                const label = item[nameKey] ?? "this item";

                return (
                    <div className="flex justify-center w-full">
                        <ConfirmDeleteModal
                            disabled={isProtected}
                            title={`Delete "${label}"?`}
                            description={
                                isProtected
                                    ? `"${label}" is a system ${type.slice(0, -1)} and cannot be deleted.`
                                    : `This will permanently delete "${label}". This action cannot be undone.`
                            }
                            onConfirm={() => onDelete(item)}
                            trigger={<Button variant="destructive">Delete</Button>}
                        />
                    </div>
                );
            },
        },
    ];
}
