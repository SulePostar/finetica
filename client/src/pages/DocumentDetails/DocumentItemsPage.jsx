import { useParams, useLocation, Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import ItemsTable from '../../components/ItemsTable/ItemsTable';
import { useDocument } from '../../hooks/useDocuments';
import { CContainer, CRow, CCol, CSpinner, CButton } from '@coreui/react';

const DocumentItemsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    // Optionally get documentType from location.state or parse from path
    const documentType = location.pathname.includes('/kif/') ? 'kif' : location.pathname.includes('/kuf/') ? 'kuf' : null;
    const { formData, loading, error } = useDocument(documentType, id);

    return (
        <DefaultLayout>
            <CContainer className="py-4">
                <CRow className="mb-3">
                    <CCol>
                        <Link to={location.state?.backUrl || `/`}> {/* fallback to home if no backUrl */}
                            <CButton color="secondary" variant="outline">Back to Details</CButton>
                        </Link>
                    </CCol>
                </CRow>
                <CRow className="justify-content-center">
                    <CCol lg={8}>
                        <h2 className="mb-4">Invoice Items</h2>
                        {loading ? (
                            <div className="text-center py-5">
                                <CSpinner color="primary" />
                            </div>
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : (
                            <ItemsTable items={formData?.items || []} />
                        )}
                    </CCol>
                </CRow>
            </CContainer>
        </DefaultLayout>
    );
};

export default DocumentItemsPage;
