import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TablePagination from "./TablePagination"

const DynamicTable = ({
    columns,
    data,
    total,
    onPageChange,
    perPage,
    page,
    header,   // npr. <PageTitle ... />
    toolbar,  // npr. Upload dugme
}) => {
    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(total / perPage),
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: perPage,
            },
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    })

    const start = total === 0 ? 0 : (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)

    return (
        <div className="w-full mx-auto rounded-2xl border border-table-border-light dark:border-table-border-dark bg-card shadow-sm">
            {/* Header unutar kartice – lijevo PageTitle, desno toolbar */}
            {(header || toolbar) && (
                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <div className="flex-1 min-w-0">
                        {header}
                    </div>
                    {toolbar && (
                        <div className="flex items-center gap-2">
                            {toolbar}
                        </div>
                    )}
                </div>
            )}

            <div className="border-t border-table-border-light dark:border-table-border-dark" />

            <div className="overflow-hidden rounded-md">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-card dark:bg-gray-background border-b border-table-border-light dark:border-table-border-dark"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-6 py-3 text-xs text-center font-semibold uppercase tracking-wide text-muted-foreground"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isStriped = row.index % 2 === 1

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={[
                                            "transition-colors",
                                            "border-b border-table-border-light dark:border-table-border-dark",
                                            isStriped
                                                ? "bg-table-row-even/70 dark:bg-table-row"
                                                : "bg-card dark:bg-purple-black",
                                            "hover:bg-table-row-even-hover/90 dark:hover:bg-table-row-odd-hover",
                                        ].join(" ")}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-6 py-3 text-center whitespace-nowrap text-[15px] text-table-text-color dark:text-white/95 font-medium align-middle"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-muted-foreground"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-3 text-xs bg-table-header/5 dark:bg-gray-background border-t border-table-border-light dark:border-table-border-dark">
                <span className="text-muted-foreground whitespace-nowrap">
                    {start}–{end} of {total}
                </span>
                <TablePagination
                    page={page}
                    perPage={perPage}
                    total={total}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}

export default DynamicTable
