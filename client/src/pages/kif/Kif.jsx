import { UploadButton } from '../../components/index';
import { CContainer, CRow, CCol } from '@coreui/react';
import { useBucketName } from '../../lib/bucketUtils';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import './Kif.styles.css';

const Kif = () => {
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
                            <DynamicTable title="KIF Table" columns={columns} apiEndpoint="http://localhost:4000/api/kif-data" />
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default Kif;