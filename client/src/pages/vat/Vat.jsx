import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import '../../styles/shared/CommonStyles.css';
import '../../styles/TablePages.css';
import './Vat.styles.css';

const Vat = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();

  const handleView = (id) => {
    navigate(`/vat/${id}`);
  };

  //Placeholder functions for edit, delete, and download actions
  const handleEdit = (row) => { };
  const handleDelete = (row) => { };
  const handleDownload = (row) => { };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Quantity', selector: row => row.amount, sortable: true },
    { name: 'Price', selector: row => row.price, sortable: true },
    { name: 'Date', selector: row => row.date, sortable: true },
    { name: 'Review Status', selector: row => row.status, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onDownload={handleDownload}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <DefaultLayout>
      <div
        className="table-page-outer"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="table-content-wrapper">
          <DynamicTable
            title="VAT"
            columns={columns}
            apiEndpoint="http://localhost:4000/api/transactions/bank-transaction-data"
            onRowClick={handleRowClick}
            uploadButton={<UploadButton bucketName={bucketName} />}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Vat;
