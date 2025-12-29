import { Badge } from "@/components/ui/badge";
import { capitalizeFirst } from "@/helpers/capitalizeFirstLetter";
import { formatValue } from "@/helpers/formatValue";

const activeColor = "bg-chart-2 dark:bg-chart-2 text-black dark:text-white";
const rejectedColor = "bg-destructive text-black dark:text-white";


const STATUS_STYLES = {
    approved: activeColor,
    pending: "bg-chart-4 dark:bg-chart-3 text-black dark:text-white",
    rejected: rejectedColor,
    default: "bg-muted text-muted-foreground dark:text-white",
    active: activeColor,
    "vat registered": activeColor,
    "not registered": rejectedColor,
};

export function ReviewStatusBadge({ status }) {
    const normalized = status?.toLowerCase();
    const safeValue = formatValue(normalized, "default");
    const color = STATUS_STYLES[safeValue] || STATUS_STYLES.default;

    return (
        <Badge className={[
            color,
            "w-fit max-w-none whitespace-nowrap px-3 min-w-[85px]"
        ].join(" ")}>
            {capitalizeFirst(safeValue)}
        </Badge>
    );
}
