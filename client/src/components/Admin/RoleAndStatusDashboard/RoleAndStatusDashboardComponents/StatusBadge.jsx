import { CBadge } from '@coreui/react';
import { capitalizeFirst } from '../../../../helpers/capitalizeFirstLetter';

function StatusBadge({ status }) {
  let badge;

  switch (status) {
    case 'pending':
      badge = <CBadge className="pill status-pill pending-custom">Pending</CBadge>;
      break;
    case 'approved':
      badge = (
        <CBadge color="success" className="pill status-pill">
          Approved
        </CBadge>
      );
      break;
    case 'rejected':
      badge = (
        <CBadge color="danger" className="pill status-pill">
          Rejected
        </CBadge>
      );
      break;
    default:
      badge = (
        <CBadge color="secondary" className="pill status-pill">
          {capitalizeFirst(status)}
        </CBadge>
      );
  }
  return badge;
}

export default StatusBadge;