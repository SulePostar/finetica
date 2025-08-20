import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import DynamicTable from '../../components/Tables/DynamicTable';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import '../../styles/shared/CommonStyles.css';
import '../../styles/TablePages.css';
import './Kif.styles.css';

const Kif = () => {
  const navigate = useNavigate();
  const bucketName = useBucketName();
  const sidebarWidth = useSidebarWidth();

  const handleView = (id) => {
    navigate(`/kif/${id}`);
  };
  //Placeholder functions for edit, delete, and download actions
  const handleEdit = (id) => {};
  const handleDelete = (id) => {};
  const handleDownload = (id) => {};

  const columns = [
    { name: 'ID', selector: (row) => row.id, sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Quantity', selector: (row) => row.amount, sortable: true },
    { name: 'Price', selector: (row) => row.price, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <ActionsDropdown
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    console.log('Navigating to:', `/kif/${row.id}`);
    navigate(`/kif/${row.id}`);
  };

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
            title="KIF"
            columns={columns}
            apiEndpoint="http://localhost:4000/api/kif"
            onRowClick={handleRowClick}
            uploadButton={<UploadButton bucketName={bucketName} />}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Kif;
