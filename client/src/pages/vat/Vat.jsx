import { UploadButton } from '../../components/index';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/TablePages.css';

const Vat = () => {
    const navigate = useNavigate();

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

    const bucketName = useBucketName();
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div
                className="table-page-outer vat-table-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <div className="table-header-controls">
                    <UploadButton bucketName={bucketName} />
                </div>
                <div className="table-content-wrapper">
                    <DynamicTable
                        title="VAT"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/vat-data"
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Vat; 