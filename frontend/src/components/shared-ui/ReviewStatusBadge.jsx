import { Badge } from "@/components/ui/badge";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatValue } from "@/helpers/formatValue";

const STATUS_STYLES = {
    approved: "bg-chart-2 dark:bg-chart-2 text-black dark:text-white",
    pending: "bg-chart-4 dark:bg-chart-3 text-black dark:text-white",
    rejected: "bg-destructive text-black dark:text-white",
    default: "bg-muted text-muted-foreground dark:text-white",
};

export function ReviewStatusBadge({ status }) {
    const normalized = status?.toLowerCase();
    const safeValue = formatValue(normalized, "default");
    const color = STATUS_STYLES[safeValue] || STATUS_STYLES.default;

    return (
        <Badge className={`${color} m-auto`}>
            {capitalizeFirst(safeValue)}
        </Badge>
    );
}
