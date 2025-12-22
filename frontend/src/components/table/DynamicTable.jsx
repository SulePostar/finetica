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

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  if (typeof path !== 'string') return undefined;
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

const DynamicTable = ({
  columns: initialColumns,
  data,
  total,
  onPageChange,
  perPage,
  page,
  header,
  toolbar,
  onRowClick,
  showColumnSelector = true,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
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

  const allTableColumns = useMemo(() => {
    if (breakpoint === "default") return initialColumns;

    const expanderColumn = {
      id: "expander",
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleRow(row.id);
          }}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground)] shadow"
        >
          {expandedRows[row.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: { isComponent: true },
    };

    return [expanderColumn, ...initialColumns];
  }, [initialColumns, expandedRows, breakpoint]);


  const table = useReactTable({
    data,
    columns: allTableColumns,
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
  const getRowLayout = (visibleCells) => {
    const expanderCell = visibleCells.find(c => c.column.id === 'expander');
    const dataCells = visibleCells.filter(c => c.column.id !== 'expander');

    const shouldOverflow = dataCells.length > visibleLimit;

    if (!shouldOverflow) {
      return { mainCells: dataCells, overflowCells: [], showExpander: false, expanderCell };
    }
    return {
      mainCells: dataCells.slice(0, visibleLimit),
      overflowCells: dataCells.slice(visibleLimit),
      showExpander: true,
      expanderCell
    };
  };

  const isExpanderVisibleGlobal = table.getRowModel().rows.some(row => {
    const dataCols = row.getVisibleCells().filter(c => c.column.id !== 'expander');
    return dataCols.length > visibleLimit;
  });

  const handleRowClick = (row, event) => {
    const target = event.target;
    const isInteractiveElement =
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('.actions-dropdown');

    if (!isInteractiveElement && onRowClick) {
      onRowClick(row.original);
    }
  };


  return (
    <div className="w-full mx-auto rounded-2xl border border-table-border-light dark:border-gray-background bg-card shadow-lg overflow-hidden">
      {breakpoint !== "default" ? (
        <TooltipProvider>
          {(header || toolbar || (showColumnSelector && table.getAllColumns().some(c => c.getCanHide()))) && (
            <div className="flex items-center justify-between px-6 pt-4 pb-2 gap-4">
              <div className="flex-1 min-w-0">{header}</div>
              <div className="flex items-center gap-2">
                {toolbar}
                {showColumnSelector && <ColumnSelector table={table} />}
              </div>
            </div>
          )}

          <div className="border-t border-table-border-light dark:border-gray-background" />

          <div className="overflow-hidden rounded-md">
            <Table className="table-fixed w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-card dark:bg-card">
                    {isExpanderVisibleGlobal && (
                      <TableHead className="w-[40px] px-0" />
                    )}
                    {headerGroup.headers.map((header) => {
                      if (header.id === 'expander') return null;

                      const visibleDataCols = table.getVisibleLeafColumns().filter(c => c.id !== 'expander');
                      const colIndex = visibleDataCols.findIndex(c => c.id === header.column.id);

                      if (colIndex >= visibleLimit) return null;

                      return (
                        <TableHead
                          key={header.id}
                          className="px-3 py-3 font-semibold text-center uppercase text-table-header dark:text-[#6c69ff] truncate"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="divide-y">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const { mainCells, overflowCells, showExpander, expanderCell } = getRowLayout(row.getVisibleCells());

                    return <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={(e) => handleRowClick(row, e)}
                        className={`transition-colors bg-card dark:bg-card hover:bg-table-row-even-hover/90 dark:hover:bg-table-row-odd-hover ${onRowClick ? 'cursor-pointer' : ''
                          }`}
                      >
                        {isExpanderVisibleGlobal && (
                          <TableCell className="px-1 text-center w-[40px]">
                            {showExpander && expanderCell ? (
                              <div className="flex items-center justify-center w-full h-full">
                                {flexRender(expanderCell.column.columnDef.cell, expanderCell.getContext())}
                              </div>
                            ) : null}
                          </TableCell>
                        )}
                        {mainCells.map((cell) => {
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
                      {expandedRows[row.id] && showExpander && (
                        <TableRow className="bg-table-row-even bg-muted border-b border-border">
                          {isExpanderVisibleGlobal && <TableCell className="p-0 border-none" />}
                          <TableCell
                            colSpan={mainCells.length}
                            className="p-4 text-sm text-muted-foreground"
                          >
                            <div className="grid gap-2">
                              {overflowCells.map((cell) => (
                                <div
                                  key={cell.id}
                                  className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 last:border-b-0 pb-1"
                                >
                                  <strong>
                                    {cell.column.columnDef.header && typeof cell.column.columnDef.header === 'string'
                                      ? cell.column.columnDef.header
                                      : cell.column.id}
                                  </strong>
                                  <span className="text-right truncate max-w-[60%]">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={allTableColumns.length} className="h-24 text-center text-muted-foreground">
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
              onClick={(e) => handleRowClick(row, e)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-300 dark:border-gray-700 p-4 ${onRowClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
                }`}
            >
              {initialColumns.map((col, index) => {
                const value = col.cell && typeof col.cell === 'function'
                  ? flexRender(col.cell, { row, table, getValue: () => getNestedValue(row.original, col.accessorKey) })
                  : (col.accessorFn ? col.accessorFn(row.original) : getNestedValue(row.original, col.accessorKey));


                return (
                  <div key={index} className="mb-3 flex flex-col gap-0.5">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-700 dark:text-gray-400">
                        {typeof col.header === "function" ? col.id : col.header}

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