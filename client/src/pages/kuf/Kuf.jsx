import UploadButton from '../../components/UploadButton/UploadButton';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown'; // <-- Import the reusable dropdown
import { useNavigate } from 'react-router-dom';
import { useBucketName } from '../../lib/bucketUtils';
import '../../styles/shared/CommonStyles.css';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/TablePages.css';
import './Kuf.styles.css';

const Kuf = () => {
    const navigate = useNavigate();
    const bucketName = useBucketName();
    const sidebarWidth = useSidebarWidth();

    const handleView = (id) => {
        navigate(`/kuf/${id}`);
    };
    // Placeholder functions for edit and download actions
    const handleEdit = (id) => { };
    const handleDownload = (id) => { };

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
                        title="KUF"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/kuf-data"
                        uploadButton={<UploadButton bucketName={bucketName} />}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Kuf;