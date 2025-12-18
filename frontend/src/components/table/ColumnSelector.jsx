import React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ColumnSelector = ({ table }) => {
    const columns = table.getAllColumns().filter(
        (column) => column.id !== "expander" && column.getCanHide()
    );

    if (columns.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
                {columns.map((column) => {
                    let headerLabel = column.id;
                    if (typeof column.columnDef.header === 'string') {
                        headerLabel = column.columnDef.header;
                    }

                    return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
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