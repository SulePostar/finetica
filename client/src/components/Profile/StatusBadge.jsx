import { CBadge } from "@coreui/react";
import { capitalizeFirst } from "../../helpers/capitalizeFirstLetter";
import { getStatusBadge } from "../../utilis/formatters";

const StatusBadge = ({ statusId, statusName, statuses }) => {
    if (statuses && statuses.length > 0) {
        return getStatusBadge(statusId, statuses);
    }

    const s = statusName?.trim().toLowerCase() || "";
    let color = "info";
    if (s === "approved") color = "success";
    else if (s === "rejected") color = "danger";
    else if (s === "pending") color = "warning";

    return <CBadge color={color}>{capitalizeFirst(statusName)}</CBadge>;
};

export default StatusBadge;
