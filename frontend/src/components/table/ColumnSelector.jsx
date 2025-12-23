import React from "react";
import { Settings2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ColumnSelector = ({ table }) => {
    const canHideAnyColumn = table.getAllColumns().some(column => column.getCanHide());

    if (!canHideAnyColumn) {
        return null;
    }

    const visibleColumnIds = table.getVisibleLeafColumns()
        .map(column => column.id).filter(id => id !== 'expander');

    const isOnlyOneVisible = visibleColumnIds.length === 1;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                    className="ml-auto group relative overflow-hidden transition-all duration-200 bg-[var(--spurple)] text-white hover:bg-[var(--spurple)]/90 hover:text-white dark:bg-[var(--spurple)] dark:text-white dark:hover:bg-[var(--spurple)]/90 dark:hover:text-white border-none"                >
                    <div className="flex items-center justify-center">
                        <Settings2 className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-2" />
                        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-0.5 group-hover:mr-0.5 group-hover:gap-0.2 transition-all duration-200 whitespace-nowrap">
                            Columns
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table.getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => {
                        const isLastVisibleColumn =
                            isOnlyOneVisible &&
                            column.getIsVisible() &&
                            column.id === visibleColumnIds[0];

                        const isDisabled = isLastVisibleColumn;
                        let headerLabel = column.id;
                        if (typeof column.columnDef.header === 'string') {
                            headerLabel = column.columnDef.header;
                        }
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => {
                                    if (isLastVisibleColumn && !value) {
                                        return;
                                    }
                                    column.toggleVisibility(!!value);
                                }}
                                disabled={isDisabled}
                            >
                                {headerLabel}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default ColumnSelector;