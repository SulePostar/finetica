import { UploadButton } from '../../components/index';
import './Kuf.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBucketName } from '../../lib/bucketUtils';
import { FaEllipsisV } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Kuf = () => {
    const navigate = useNavigate();

    const handleView = (row) => {
        navigate(`/kuf/${row.id}`);
    };
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
                <Dropdown className="action-dropdown">
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleView(row)}>View</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEdit(row)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(row)}>Delete</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownload(row)}>Download</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
                className="kuf-table-outer"
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