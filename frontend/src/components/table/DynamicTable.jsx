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
        <div className="w-full mx-auto rounded-xl overflow-hidden border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="bg-table-header hover:bg-table-header !border-b-2 border-table-border-light dark:bg-gray-background"
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="font-bold text-white p-5 py-6 text-[16px]"
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
                <TableBody className="divide-y">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="bg-table-row-even dark:bg-light-gray hover:bg-table-row-even-hover text-black/70 dark:text-white/95"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}
                                        className="px-6 py-3 whitespace-nowrap text-[15px] text-table-text-color !font-bold dark:text-white border-b-2 border-white dark:border-white/60"
                                    >
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
            <div className="flex items-center justify-end py-4 p-2 gap-2 text-white bg-table-header dark:bg-gray-background !border-t-2 border-table-border-light dark:border-table-border-dark">
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