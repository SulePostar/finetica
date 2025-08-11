import React from 'react';
import { useParams } from 'react-router-dom';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';
import DefaultLayout from '../../layout/DefaultLayout';
import './KifDetail.styles.css';

const KifDetail = () => {
    const { id } = useParams();


    const mockKifData = {
        id: id || '1',
        name: 'Sample KIF Document',
        amount: 150,
        price: 25.50,
        date: '2024-01-15',
        status: 'Active',
        description: 'This is a sample KIF document for demonstration purposes.',
        category: 'Invoice',
        supplier: 'Sample Supplier Ltd.',
        total: 3825.00,
        currency: 'EUR',
        documentNumber: 'KIF-2024-001',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T14:45:00Z'
    };



    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 kif-detail-layout">
                <CContainer fluid className="kif-detail-container">

                    <CRow className="mb-4">

                    </CRow>

                    <CRow className="justify-content-center">

                        <CCol lg={4} className="mb-4 kif-info-column">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" />
                                        Document Information
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="text-center">
                                        <CIcon icon={cilFile} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                                        <p className="text-muted">Document information will be displayed here</p>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>


                        <CCol lg={6} className="mb-4">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" />
                                        Document Viewer
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="text-center">
                                        <CIcon icon={cilFile} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                                        <p className="text-muted">Document viewer will be displayed here</p>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </DefaultLayout>
    );
};

export default KifDetail;
