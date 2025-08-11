import { UploadButton } from '../../components/index';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';
import DynamicTable from '../../components/Tables/DynamicTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';

const Vat = () => {
    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Quantity', selector: row => row.amount, sortable: true },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Date', selector: row => row.date, sortable: true },
    ];

    const bucketName = useBucketName();
    const sidebarShow = useSelector(state => state.ui.sidebarShow);

    return (
        <DefaultLayout>
            <div
                className={`vat-table-outer ${sidebarShow ? 'sidebar-open' : 'sidebar-closed'}`}
            >
                <div className="w-100 d-flex justify-content-end align-items-center mb-3">
                    <UploadButton bucketName={bucketName} />
                </div>
                <div className="w-100 d-flex justify-content-center align-items-center flex-grow-1">
                    <DynamicTable
                        title="VAT Table"
                        columns={columns}
                        apiEndpoint="http://localhost:4000/api/vat-data"
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Vat;