import { CCol, CContainer, CRow } from '@coreui/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '../../components/index';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useBucketName } from '../../lib/bucketUtils';
import './Kuf.styles.css';

const Kuf = () => {
    const navigate = useNavigate();
    const bucketName = useBucketName();

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Quantity', selector: row => row.amount, sortable: true },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Date', selector: row => row.date, sortable: true },
    ];

    const handleRowClick = (row) => {
        console.log('Row clicked:', row);
        console.log('Navigating to:', `/kuf/${row.id}`);
        navigate(`/kuf/${row.id}`);
    };
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

                <CContainer className="h-100" fluid>
                    <CRow>
                        <CCol>
                            <DynamicTable
                                title="KUF Table"
                                columns={columns}
                                apiEndpoint="http://localhost:4000/api/kuf-data"
                                onRowClick={handleRowClick}
                            />
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default Kuf;