import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";

const hasHiddenColumns = (row) => {
    return row.getAllCells().some((cell) => !cell.column.getIsVisible());
};

const DynamicTable = ({ columns: initialColumns, data, total, onPageChange, perPage, page }) => {

    const breakpoint = useTailwindBreakpoint();
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const columns = useMemo(() => [
        {
            id: "expander",
            header: () => null,
            cell: ({ row }) =>
                hasHiddenColumns(row) ? (
                    <button
                        onClick={() => toggleRow(row.id)}
                        className="w-6 h-6 flex items-center justify-center p-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm font-bold shadow transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                        aria-label={expandedRows[row.id] ? "Collapse row" : "Expand row"}
                    >
                        {expandedRows[row.id] ? "➖" : "➕"}
                    </button>
                ) : null,
            enableSorting: false,
            enableHiding: false,
            size: 50,
        },
        ...initialColumns,
    ], [initialColumns, expandedRows]);

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

    const updateColumnVisibility = useCallback(() => {
        const tableColumns = table.getAllColumns();

        tableColumns.forEach((column, index) => {
            if (index === 0) {
                column.toggleVisibility(true);
                return;
            }

            switch (breakpoint) {
                case 'default':
                    column.toggleVisibility(index <= 1);
                    break;
                case 'sm':
                    column.toggleVisibility(index <= 3);
                    break;
                case 'md':
                    column.toggleVisibility(index <= 5);
                    break;
                case 'lg':
                case 'xl':
                    column.toggleVisibility(true);
                    break;
                default:
                    column.toggleVisibility(true);
                    break;
            }
        });

    }, [breakpoint, table]);

    useEffect(() => {
        updateColumnVisibility();
    }, [updateColumnVisibility]);

    return (
        <div className="w-full mx-auto rounded-4xl overflow-hidden border">
            <Table className="table-fixed w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="bg-table-header hover:bg-table-header !border-b-2 border-table-border-light dark:bg-gray-background"
                        >
                            {headerGroup.headers.map((header) => {
                                const isExpander = header.column.id === 'expander';
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={`font-bold text-white p-4 py-5 text-[16px] truncate overflow-hidden ${isExpander ? 'w-[50px] p-2 text-center' : ''}`}
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
                            <React.Fragment key={row.id}>
                                <TableRow
                                    data-state={row.getIsSelected() && "selected"}
                                    className="bg-table-row-even dark:bg-light-gray hover:bg-table-row-even-hover text-black/70 dark:text-white/95"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}
                                            className="px-4 sm:px-6 py-3 text-[15px] text-table-text-color !font-bold dark:text-white border-b-2 border-white dark:border-white/60 truncate overflow-hidden"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {expandedRows[row.id] && hasHiddenColumns(row) && (
                                    <TableRow className="bg-gray-100 dark:bg-gray-800/80 border-b-2 border-white dark:border-white/60">
                                        <TableCell className="p-0 border-none" />

                                        <TableCell
                                            colSpan={row.getVisibleCells().length - 1}
                                            className="p-4 text-sm"
                                        >
                                            <div className="grid gap-2 p-1">
                                                {row.getAllCells()
                                                    .filter((cell) => !cell.column.getIsVisible())
                                                    .map((cell) => (
                                                        <div
                                                            key={cell.id}
                                                            className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-1"
                                                        >
                                                            <strong className="text-black/80 dark:text-gray-400 min-w-[100px] font-semibold">
                                                                {cell.column.columnDef.header.toString()}:
                                                            </strong>{" "}
                                                            <span className="text-black/70 dark:text-white/80 truncate max-w-[70%] text-right">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
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