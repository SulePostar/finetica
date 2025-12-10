"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TablePagination from "./TablePagination"

const DynamicTable = ({
    columns,
    data,
    total,
    onPageChange,
    perPage,
    page,
    header,
    toolbar,
}) => {

    const [columnVisibility, setColumnVisibility] = useState({})

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(total / perPage),

        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: perPage,
            },
            columnVisibility,
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
    })

    return (
        <div className="w-full mx-auto rounded-2xl border border-table-border-light dark:border-gray-background bg-card shadow-lg">

            {/* Header, Toolbar, and Column Visibility Controls */}
            {(header || toolbar || table.getAllColumns().some(c => c.getCanHide())) && (
                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <div className="flex-1 min-w-0">{header}</div>

                    <div className="flex items-center gap-2">
                        {toolbar}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    // Only show columns that are allowed to be hidden
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}

            <div className="border-t border-table-border-light dark:border-gray-background" />

            <div className="overflow-hidden rounded-md">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-card dark:bg-card"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-6 py-3 text-s text-center font-semibold uppercase tracking-wide text-table-header  dark:text-[#6c69ff]"
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="transition-colors bg-card dark:bg-card 
                                    hover:bg-table-row-even-hover/90 dark:hover:bg-table-row-odd-hover"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-6 py-3 text-center whitespace-nowrap text-[15px] text-muted-foreground dark:text-muted-foreground font-medium"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-muted-foreground text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center rounded-md justify-between px-6 py-3 text-xs bg-table-header/5 dark:bg-gray-background border-t border-table-border-light dark:border-gray-background">
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