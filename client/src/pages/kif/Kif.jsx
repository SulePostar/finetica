import { UploadButton } from '../../components/index';
import { CContainer, CRow, CCol } from '@coreui/react';
import { useBucketName } from '../../lib/bucketUtils';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Kif.styles.css';

const Kif = () => {
    const navigate = useNavigate();

    const handleView = (row) => {
        console.log('View row:', row);
        navigate(`/kif/${row.id}`);
    };
    const handleEdit = (row) => {
        console.log('Edit row:', row);
    };
    const handleDelete = (row) => {
        console.log('Delete row:', row);
    };
    const handleDownload = (row) => {
        console.log('Download row:', row);
    };



    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Quantity', selector: row => row.amount, sortable: true },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Date', selector: row => row.date, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Actions
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

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3" style={{ paddingTop: '80px' }}>


                <div className="d-flex justify-content-end mb-3">
                    <UploadButton
                        bucketName={bucketName}
                    />
                </div>

                <CContainer className="h-100" fluid>
                    <CRow>
                        <CCol>
                            <DynamicTable title="KIF Table" columns={columns} apiEndpoint="http://localhost:4000/api/kif-data" />
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default Kif;