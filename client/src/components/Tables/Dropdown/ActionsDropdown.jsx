import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import './ActionsDropdown.css';

/**
 * Fleksibilan dropdown meni za akcije u tabeli.
 * Prikazuje opcije samo ako su odgovarajuće funkcije prosleđene kao props.
 * @param {object} props
 * @param {object} props.row - Podaci za trenutni red.
 * @param {Function} [props.onView] - Funkcija za "View".
 * @param {Function} [props.onEdit] - Funkcija za "Edit".
 * @param {Function} [props.onDelete] - Funkcija za "Delete".
 * @param {Function} [props.onApprove] - Funkcija za "Approve".
 * @param {Function} [props.onDownload] - Funkcija za "Download".
 * @param {boolean} [props.isApproved] - Fleg koji označava da li je stavka odobrena.
 */
const ActionsDropdown = ({
  row,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onDownload,
  isApproved,
}) => (
  <Dropdown className="action-dropdown">
    <Dropdown.Toggle variant="secondary" id={`dropdown-${row.id}`}>
      <FaEllipsisV />
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {/* Prikazuje "View" ako postoji onView funkcija */}
      {onView && <Dropdown.Item onClick={() => onView(row.id)}>View</Dropdown.Item>}

      {/* Prikazuje "Edit" ako postoji onEdit funkcija */}
      {onEdit && <Dropdown.Item onClick={() => onEdit(row.id)}>Edit</Dropdown.Item>}

      {/* Prikazuje "Approve" samo ako nije odobreno i ako postoji onApprove funkcija */}
      {onApprove && !isApproved && <Dropdown.Item onClick={() => onApprove(row.id)}>Approve</Dropdown.Item>}

      {/* Prikazuje "Download" ako postoji onDownload funkcija */}
      {onDownload && <Dropdown.Item onClick={() => onDownload(row.id)}>Download</Dropdown.Item>}

      {/* Prikazuje "Delete" sa separatorom, ako postoji onDelete funkcija */}
      {onDelete && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => onDelete(row.id)} className="text-danger">
            Delete
          </Dropdown.Item>
        </>
      )}
    </Dropdown.Menu>
  </Dropdown>
);

export default ActionsDropdown;
