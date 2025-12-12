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
import ColumnSelector from "./ColumnSelector";
import TablePagination from "./TablePagination";
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const DynamicTable = ({
    columns: initialColumns,
    data,
    total,
    onPageChange,
    perPage,
    page,
    header,
    toolbar,
}) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [columnVisibility, setColumnVisibility] = useState({})

    const breakpoint = useTailwindBreakpoint();

    const toggleRow = (rowId) =>
        setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));

    const visibleLimit = useMemo(() => {
        switch (breakpoint) {
            case "default": return 1;
            case "xs": return 3;
            case "sm": return 4;
            case "md": return 6;
            case "lg":
            case "xl": return Infinity;
            default: return Infinity;
        }
    }, [breakpoint]);

    const needsExpander = initialColumns.length > visibleLimit;


    const columns = useMemo(() => {
        const actualVisibleLimit =
            breakpoint === "default" ? initialColumns.length : visibleLimit;

        const visibleColumns = initialColumns.slice(0, actualVisibleLimit);

        if (breakpoint === "default" || !needsExpander) return visibleColumns;

        const expanderColumn = {
            id: "expander",
            header: () => null,
            cell: ({ row }) => (
                <button
                    onClick={() => toggleRow(row.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground)] shadow"
                >
                    {expandedRows[row.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        };

        return [expanderColumn, ...visibleColumns];
    }, [initialColumns, visibleLimit, needsExpander, expandedRows, breakpoint]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        pageCount: Math.ceil(total / perPage),
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: perPage,
            },
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <div className="w-full mx-auto rounded-2xl border border-table-border-light dark:border-gray-background bg-card shadow-lg overflow-hidden">
            {breakpoint !== "default" ? (
                <TooltipProvider>
                    {(header || toolbar || table.getAllColumns().some(c => c.getCanHide())) && (
                        <div className="flex items-center justify-between px-6 pt-4 pb-2 gap-4">
                            <div className="flex-1 min-w-0">{header}</div>
                            <div className="flex items-center gap-2">
                                {toolbar}
                                <ColumnSelector table={table} />
                            </div>
                        </div>
                    )}

                    <div className="border-t border-table-border-light dark:border-gray-background" />
                    <div className="overflow-hidden rounded-md">

                        <Table className="table-fixed w-full">

                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-card dark:bg-card">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className={`px-3 py-3 font-semibold text-center uppercase text-table-header dark:text-[#6c69ff] truncate ${header.column.id === "expander" ? "w-[40px] px-0" : ""
                                                    }`}
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

                            <TableBody className="divide-y">
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <React.Fragment key={row.id}>
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                                className="transition-colors bg-card dark:bg-card hover:bg-table-row-even-hover/90 dark:hover:bg-table-row-odd-hover"
                                            >
                                                {row.getVisibleCells().map((cell) => {
                                                    const rendered = flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    );
                                                    const meta = cell.column.columnDef.meta || {};
                                                    const isExplicitComponent = meta.isComponent;
                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            className={`px-3 py-3 text-center whitespace-nowrap text-[15px] text-muted-foreground dark:text-muted-foreground font-medium  ${cell.column.id === "expander" ? "px-1" : ""}`}
                                                        >
                                                            {!isExplicitComponent ? (
                                                                <Tooltip delayDuration={800}>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="max-w-[18ch] sm:max-w-[22ch] md:max-w-[26ch] overflow-hidden text-ellipsis whitespace-nowrap text-center cursor-default">
                                                                            {rendered}
                                                                        </div>
                                                                    </TooltipTrigger>

                                                                    <TooltipContent className="max-w-[300px] break-words bg-black text-white dark:bg-white dark:text-black">
                                                                        <div>{rendered}</div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <div className={`flex items-center justify-center w-full h-full px-0 py-0 text-xs sm:text-sm max-w-full`}>
                                                                    {rendered}
                                                                </div>)
                                                            }
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                            {expandedRows[row.id] && needsExpander && (
                                                <TableRow className="bg-table-row-even dark:bg-light-gray border-b dark:border-white/60">
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
                                                                            getValue: () =>
                                                                                row.original[col.accessorKey],
                                                                        })
                                                                        : row.original[col.accessorKey];

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 last:border-b-0 pb-1"
                                                                    >
                                                                        <strong>
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

                    </div>
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
                                            <strong className="text-gray-700 dark:text-gray-400">
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
            <div className="flex items-center rounded-md justify-between px-6 py-3 text-xs bg-table-header/5 dark:bg-gray-background border-t border-table-border-light dark:border-gray-background">
                <TablePagination
                    page={page}
                    perPage={perPage}
                    total={total}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default DynamicTable;