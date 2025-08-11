import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';

const ActionsDropdown = ({ row, onView, onEdit, onDelete, onDownload }) => (
    <Dropdown className="action-dropdown">
        <Dropdown.Toggle variant="secondary" id={`dropdown-${row.id}`}>
            <FaEllipsisV />
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => onView(row.id)}>View</Dropdown.Item>
            <Dropdown.Item onClick={() => onEdit(row.id)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(row.id)}>Delete</Dropdown.Item>
            <Dropdown.Item onClick={() => onDownload(row.id)}>Download</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

export default ActionsDropdown;