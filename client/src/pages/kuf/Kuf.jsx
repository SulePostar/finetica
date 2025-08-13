import { UploadButton } from '../../components/index';
import './Kuf.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown'; // <-- Import the reusable dropdown
import { useNavigate } from 'react-router-dom';
import { useBucketName } from '../../lib/bucketUtils';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/TablePages.css';

const Kuf = () => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/kuf/${id}`);
    };
    // Placeholder functions for edit, delete, and download actions
    const handleEdit = (id) => { };
    const handleDelete = (id) => { };
    const handleDownload = (id) => { };

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
                className="table-page-outer kuf-table-outer"
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
                        title="KUF Table"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/kuf-data"
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Kuf;