import React, { useState, useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "./TablePagination";
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const DynamicTable = ({ columns: initialColumns, data, total, onPageChange, perPage, page }) => {

    const breakpoint = useTailwindBreakpoint();
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (rowId) =>
        setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));

    const visibleLimit = useMemo(() => {
        switch (breakpoint) {
            case "default": return 1;
            case "xs": return 2;
            case "sm": return 4;
            case "md": return 6;
            case "lg":
            case "xl": return Infinity;
            default: return Infinity;
        }
    }, [breakpoint]);

    const needsExpander = initialColumns.length > visibleLimit;

    const columns = useMemo(() => {
        const actualVisibleLimit = breakpoint === 'default' ? initialColumns.length : visibleLimit;

        const visibleColumns = initialColumns.slice(0, actualVisibleLimit);

        if (breakpoint === 'default' || !needsExpander) return visibleColumns;

        const expanderColumn = {
            id: "expander",
            header: () => null,
            cell: ({ row }) => (
                <button
                    onClick={() => toggleRow(row.id)}
                    className=" w-6 h-6 flex items-center justify-center p-0.5 rounded-full  bg-[var(--muted)]  text-[var(--foreground)]  dark:bg-[var(--muted)]  dark:text-[var(--foreground)  shadow"
                >
                    {expandedRows[row.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
        };
        return [expanderColumn, ...visibleColumns];
    }, [initialColumns, visibleLimit, needsExpander, expandedRows, breakpoint]);

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
    });

    return (
        <div className="w-full mx-auto rounded-xl overflow-hidden">
            {breakpoint !== "default" ? (
                <TooltipProvider>

                    <Table className="table-fixed w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-table-header hover:bg-table-header !border-b-2 border-table-border-light dark:bg-gray-background"
                                >
                                    {headerGroup.headers.map((header) => {
                                        const isExpander = header.column.id === "expander";
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`font-bold text-white p-5 py-6  text-[16px] text-center truncate ${isExpander ? "w-[50px] p-2" : ""
                                                    }`}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody className="divide-y">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="bg-table-row-even dark:bg-light-gray hover:bg-table-row-even-hover text-black/70 dark:text-white/95 truncate"
                                        >
                                            {row.getVisibleCells().map((cell) => (

                                                <TableCell
                                                    key={cell.id}
                                                    className="px-3 py-3 text-[15px] text-table-text-color !font-bold dark:text-white border-b-2 border-white dark:border-white/60"
                                                >
                                                    <Tooltip delayDuration={800}>
                                                        <TooltipTrigger asChild>
                                                            <div className="max-w-[14ch] sm:max-w-[18ch] md:max-w-[22ch] overflow-hidden text-ellipsis whitespace-nowrap text-center cursor-default">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </TooltipTrigger>

                                                        <TooltipContent className="max-w-[300px] break-words bg-black text-white dark:bg-white dark:text-black">
                                                            <p>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                            ))}
                                        </TableRow>

                                        {expandedRows[row.id] && needsExpander && (
                                            <TableRow className="bg-table-row-even dark:bg-light-gray border-b-2  dark:border-white/60">
                                                <TableCell className="p-0 border-none" />
                                                <TableCell
                                                    colSpan={row.getVisibleCells().length - 1}
                                                    className="p-4 text-sm"
                                                >
                                                    <div className="grid gap-2">
                                                        {initialColumns.slice(visibleLimit).map((col, index) => {
                                                            const value =
                                                                col.cell
                                                                    ? flexRender(col.cell, {
                                                                        row,
                                                                        table,
                                                                        getValue: () => row.original[col.accessorKey],
                                                                    })
                                                                    : row.original[col.accessorKey];
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 last:border-b-0 pb-1"
                                                                >
                                                                    <strong className="font-semibold ">
                                                                        {typeof col.header === "function"
                                                                            ? flexRender(col.header, table)
                                                                            : col.header}
                                                                    </strong>
                                                                    <span className="text-right truncate max-w-[60%]">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
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
                </TooltipProvider>
            ) : (
                <div className="px-2 py-4 space-y-4">
                    {table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-300 dark:border-gray-700 p-4"
                        >
                            {initialColumns.map((col, index) => {
                                const value =
                                    col.cell
                                        ? flexRender(col.cell, {
                                            row,
                                            table,
                                            getValue: () => row.original[col.accessorKey],
                                        })
                                        : row.original[col.accessorKey];

                                return (
                                    <div key={index} className="mb-3 flex flex-col gap-0.5">
                                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            <strong className="font-semibold text-gray-700 dark:text-gray-400">
                                                {typeof col.header === "function"
                                                    ? flexRender(col.header, table)
                                                    : col.header}
                                            </strong>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex items-center justify-end py-4 p-2 gap-2 text-white bg-table-header dark:bg-gray-background border-t-2 border-table-border-light dark:border-table-border-dark">
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