import { UploadButton } from '../../components/index';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown'; // <-- Import the reusable dropdown
import { useNavigate } from 'react-router-dom';
import { useBucketName } from '../../lib/bucketUtils';
import { useSelector } from 'react-redux';
import '../../styles/shared/CommonStyles.css';
import './Kuf.styles.css';

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
    const sidebarShow = useSelector(state => state.ui.sidebarShow);
    const sidebarWidth = 250;

    return (
        <DefaultLayout>
            <div
                className="table-outer"
                style={{
                    marginLeft: sidebarShow ? sidebarWidth : 0
                }}
            >
                <div className="w-100 d-flex justify-content-end align-items-center mb-3">
                    <UploadButton bucketName={bucketName} />
                </div>
                <div className="w-100 d-flex justify-content-center align-items-center flex-grow-1">
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