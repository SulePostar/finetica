import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import './ActionsDropdown.css';

const ActionsDropdown = ({ row, onView, onApprove, onDownload }) => (
    <Dropdown className="action-dropdown">
        <Dropdown.Toggle variant="secondary" id={`dropdown-${row.id}`}>
            <FaEllipsisV />
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => onView(row.id)}>View</Dropdown.Item>
            <Dropdown.Item onClick={() => onApprove(row.id)}>Approve</Dropdown.Item>
            <Dropdown.Item onClick={() => onDownload(row.id)}>Download</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

export default ActionsDropdown;