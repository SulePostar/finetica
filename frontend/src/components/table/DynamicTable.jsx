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

const DynamicTable = ({ columns, data, total, onPageChange, perPage, page }) => {
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

    return (
        <div className="rounded-lg overflow-hidden border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="bg-table-header hover:bg-table-header !border-b-2 border-table-border-light dark:border-table-border-dark"
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="font-bold text-white py-4"
                                    >
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={
                                    row.index % 2 === 0
                                        ? "bg-table-row-even hover:bg-table-row-even-hover text-black/70 dark:text-white/95"    // even rows
                                        : "bg-table-row-odd hover:bg-table-row-odd-hover text-white"                            // odd rows
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end p-2 gap-2 text-white bg-table-header !border-t-2 border-table-border-light dark:border-table-border-dark">
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

export default DynamicTable;