import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './Partner.css';

// Preimenuj komponentu u Partner
const Partner = () => {
  const navigate = useNavigate();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // Promeni endpoint da gađa partnere
  const apiEndpoint = useMemo(() => `${API_BASE}/partners`, [API_BASE]);

  const handleView = useCallback(
    (id) => {
      navigate(`/partners/${id}`); // Promeni rutu
    },
    [navigate]
  );

  // Definiši kolone za partnere
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Short Name',
      selector: (row) => row.short_name,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: 'VAT Number',
      selector: (row) => row.vat_number,
      sortable: true,
    },
    {
      name: 'Actions',
      width: '140px',
      cell: (row) => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          // Ovde možeš dodati onEdit, onDelete itd.
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer partner-table-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="partner-table-responsive">
          <DynamicTable
            title="Partners"
            columns={columns}
            apiEndpoint={apiEndpoint}
            // Partneri verovatno nemaju upload, pa je ovo uklonjeno
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

// Promeni i export
export default Partner;
