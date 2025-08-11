import { CContainer, CRow, CCol } from '@coreui/react';
import { UploadButton } from '../../components/index';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import ActionsDropdown from '../../components/Tables/Dropdown/ActionsDropdown';

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

    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3">
                <CCol>
                    <div className="d-flex justify-content-end align-items-center">
                        <UploadButton
                            bucketName={bucketName}
                        />
                    </div>
                </CCol>
                <CContainer className="h-100" fluid>
                    <CRow>
                        <CCol>
                            <DynamicTable title="VAT Table" columns={columns} apiEndpoint="http://localhost:4000/api/vat-data" />

                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default Vat; 