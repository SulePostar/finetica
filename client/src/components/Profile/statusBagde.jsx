import { CBadge } from '@coreui/react';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';

const StatusBadge = ({ statusName }) => {
    const s = statusName?.trim().toLowerCase() || '';
    let color = 'info';
    if (s === 'approved') color = 'success';
    else if (s === 'rejected') color = 'danger';
    else if (s === 'pending') color = 'warning';

    return <CBadge color={color}>{capitalizeFirst(statusName)}</CBadge>;
};

export default StatusBadge;
