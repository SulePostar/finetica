import { UploadButton } from '../../components/index';
import { useBucketName } from '../../lib/bucketUtils';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown'; // Import your dropdown component
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Kif.styles.css';

const Kif = () => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/kif/${id}`);
    };
    //Placeholder functions for edit, delete, and download actions
    const handleEdit = (id) => {
        console.log(`Edit action for ID: ${id}`);
    };
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
                className="kif-table-outer"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'margin-left 0.3s',
                    marginLeft: sidebarShow ? sidebarWidth : 0,
                    padding: 0,
                }}
            >
                <div className="w-100 d-flex justify-content-end align-items-center mb-3">
                    <UploadButton bucketName={bucketName} />
                </div>
                <div className="w-100 d-flex justify-content-center align-items-center flex-grow-1">
                    <DynamicTable
                        title="KIF Table"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/kif-data"
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Kif;