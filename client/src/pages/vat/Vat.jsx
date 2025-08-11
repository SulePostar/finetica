import { CContainer, CRow, CCol } from '@coreui/react';
import { UploadButton } from '../../components/index';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { Container } from 'react-bootstrap';

const Vat = () => {

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Quantity', selector: row => row.amount, sortable: true },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Date', selector: row => row.date, sortable: true },
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
                            <DynamicTable title="VAT Table" columns={columns} apiEndpoint="http://localhost:4000/api/vat-data" />
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default Vat;