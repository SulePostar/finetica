import CompactUploadButton from '../../components/UploadButton/CompactUploadButton';
import { useBucketName } from '../../lib/bucketUtils';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/shared/CommonStyles.css';
import './Vat.styles.css';
import '../../styles/TablePages.css';

const Vat = () => {
    const navigate = useNavigate();
    const bucketName = useBucketName();
    const sidebarWidth = useSidebarWidth();

    const handleView = (row) => {
        navigate(`/vat/${row.id}`);
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
        {
            name: 'Actions',
            cell: row => (
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
        }
    ];

    const handleRowClick = (row) => {
        console.log('Row clicked:', row);
        console.log('Navigating to:', `/vat/${row.id}`);
        navigate(`/vat/${row.id}`);
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
                        title="VAT"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/vat-data"
                        onRowClick={handleRowClick}
                        uploadButton={<CompactUploadButton bucketName={bucketName} />}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Vat; 