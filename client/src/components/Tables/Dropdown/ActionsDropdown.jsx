import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import './ActionsDropdown.css';

const ActionsDropdown = ({
  row,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onDownload,
  isApproved,
  isSaved = false,
}) => {
  return (
    <Dropdown className="action-dropdown">
      <Dropdown.Toggle variant="secondary" id={`dropdown-${row.id}`}>
        <FaEllipsisV />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* View option */}
        {onView && <Dropdown.Item onClick={() => onView(row.id)}>View</Dropdown.Item>}

        {/* Edit option - only show if not saved AND edit function exists */}
        {onEdit && !isSaved && (
          <Dropdown.Item onClick={() => onEdit(row.id)}>
            Edit
          </Dropdown.Item>
        )}

        {/* Approve option */}
        {onApprove && !isApproved && (
          <Dropdown.Item onClick={() => onApprove(row.id)}>
            Approve
          </Dropdown.Item>
        )}

        {/* Download option */}
        {onDownload && (
          <Dropdown.Item onClick={() => onDownload(row.id)}>
            Download
          </Dropdown.Item>
        )}

        {/* Delete option with separator */}
        {onDelete && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => onDelete(row.id)}
              className="text-danger"
              disabled={isSaved}
            >
              Delete
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActionsDropdown;