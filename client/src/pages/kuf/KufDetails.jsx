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
import './KufDetails.styles.css';

const KufDetails = () => {
    const { id } = useParams();


    const mockKufData = {
        id: id || '1',
        name: 'Sample KUF Document',
        amount: 150,
        price: 25.50,
        date: '2024-01-15',
        status: 'Active',
        description: 'This is a sample KUF document for demonstration purposes.',
        category: 'Invoice',
        supplier: 'Sample Supplier Ltd.',
        total: 3825.00,
        currency: '$',
        documentNumber: 'KUF-2024-001',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T14:45:00Z'
    };


    return (
        <DefaultLayout>
            <div className="body flex-grow-1 px-3 kuf-detail-layout">
                <CContainer fluid className="kuf-detail-container">

                    <CRow className="mb-4">

                    </CRow>

                    <CRow className="justify-content-center">

                        <CCol lg={4} className="mb-4 kuf-info-column">
                            <CCard className="h-100 shadow-sm detail-card">
                                <CCardHeader>
                                    <CCardTitle className="mb-0">
                                        <CIcon icon={cilFile} className="me-2" />
                                        Document Information
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="kuf-info-list">
                                        <div className="info-row">
                                            <span className="info-label">Document:</span>
                                            <span className="info-value">{mockKufData.documentNumber}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Name:</span>
                                            <span className="info-value">{mockKufData.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Supplier:</span>
                                            <span className="info-value">{mockKufData.supplier}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Category:</span>
                                            <span className="info-value">{mockKufData.category}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Amount:</span>
                                            <span className="info-value">{mockKufData.amount}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Price:</span>
                                            <span className="info-value">{mockKufData.price} {mockKufData.currency}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Total:</span>
                                            <span className="info-value">{mockKufData.total} {mockKufData.currency}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Status:</span>
                                            <span className="info-value">{mockKufData.status}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Date:</span>
                                            <span className="info-value">{mockKufData.date}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Created:</span>
                                            <span className="info-value">{new Date(mockKufData.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Updated:</span>
                                            <span className="info-value">{new Date(mockKufData.updatedAt).toLocaleString()}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Description:</span>
                                            <span className="info-value">{mockKufData.description}</span>
                                        </div>
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

export default KufDetails;