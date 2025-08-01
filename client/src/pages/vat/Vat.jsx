import { AppHeader, AppSidebar, UploadButton } from '../../components/index';
import { CContainer, CRow, CCol } from '@coreui/react';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';

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
        <>
            <AppSidebar />
            <CContainer className="wrapper d-flex flex-column min-vh-100" fluid>
                <AppHeader />

                {/* Main content area */}
                <div className="body flex-grow-1 px-3">
                    <CContainer className="h-100" fluid>
                        {/* Page header with upload button */}
                        <CRow className="mb-2">
                            <CCol>
                                <div className="d-flex justify-content-end align-items-center">
                                    <UploadButton
                                        bucketName={bucketName}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol>
                                <DynamicTable title="VAT Table" columns={columns} apiEndpoint="http://localhost:4000/api/vat-data" />

                            </CCol>
                        </CRow>
                    </CContainer>
                </div>
            </CContainer>
        </>
    );
};

export default Vat; 