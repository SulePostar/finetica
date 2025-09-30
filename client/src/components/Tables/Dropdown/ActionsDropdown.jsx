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
  const id = row?.id;

  return (
    <Dropdown
      className="action-dropdown"
      drop="up"
      align="end"
    >
      <Dropdown.Toggle
        id={`dropdown-${id ?? 'row'}`}
        variant="secondary"
        className="action-dropdown-toggle"
        size="sm"
      >
        <FaEllipsisV />
      </Dropdown.Toggle>

      <Dropdown.Menu
        renderOnMount
        className="action-dropdown-menu"
        role="menu"
        popperConfig={{
          strategy: 'fixed',
          modifiers: [
            { name: 'flip', enabled: true }, // <-- add this
            { name: 'offset', options: { offset: [0, 10] } },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                altBoundary: true,
                tether: false,
              },
            },
            { name: 'computeStyles', options: { adaptive: false } },
          ],
        }}
      >
        {onView && <Dropdown.Item onClick={() => onView(id)}>View</Dropdown.Item>}
        {onEdit && !isSaved && <Dropdown.Item onClick={() => onEdit(id)}>Edit</Dropdown.Item>}
        {onApprove && !isApproved && <Dropdown.Item onClick={() => onApprove(id)}>Approve</Dropdown.Item>}
        {onDownload && <Dropdown.Item onClick={() => onDownload(id)}>Download</Dropdown.Item>}
        {onDelete && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => onDelete(id)} className="text-danger">Delete</Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default ActionsDropdown;

