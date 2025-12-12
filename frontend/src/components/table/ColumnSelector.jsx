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
                <Button variant="outline" size="sm">
                    Columns
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
                                {column.id}
                                {isDisabled && (
                                    <span className="ml-2 text-xs text-muted-foreground">(Min 1)</span>
                                )}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ColumnSelector;