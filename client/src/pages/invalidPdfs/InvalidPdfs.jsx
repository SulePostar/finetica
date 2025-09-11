import { cilCalculator, cilDescription, cilFolderOpen, cilWallet } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTabPane,
} from '@coreui/react';
import { useState } from 'react';
import { InvalidPdfDetails } from '../../components/InvalidPdfDetails/InvalidPdfDetails';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './InvalidPdfs.css';

const InvalidPdfs = () => {
    const [activeKey, setActiveKey] = useState(1);
    const sidebarWidth = useSidebarWidth();

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const endpoints = {
        bank: `${API_BASE}/bank-transactions`,
        kif: `${API_BASE}/kif`,
        kuf: `${API_BASE}/kuf/logs/invalid`,
        contracts: `/contracts/logs/invalid`,
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRow({ ...row, type: activeKey });
        setModalOpen(true);
    };

    const logColumns = [
        {
            name: 'File Name',
            selector: (row) => row.filename,
            sortable: true,
            wrap: true,
            width: '200px',
        },
        {
            name: 'Message',
            selector: (row) => row.message || '-',
            sortable: false,
            wrap: true,
            width: '400px',
        },
        {
            name: 'Status',
            selector: (row) => row.isValid,
            sortable: true,
            width: '150px',
            cell: (row) =>
                row.isValid ? (
                    <CBadge color="success">valid</CBadge>
                ) : (
                    <CBadge color="warning">invalid</CBadge>
                ),
        },
        {
            name: 'Processed',
            selector: (row) => row.isProcessed,
            sortable: true,
            width: '150px',
            cell: (row) =>
                row.isProcessed ? <CBadge color="success">Yes</CBadge> : <CBadge color="danger">No</CBadge>,
        },
        {
            name: 'Processed At',
            selector: (row) => row.processedAt,
            sortable: true,
            width: '150px',
            cell: (row) => (row.processedAt ? new Date(row.processedAt).toLocaleString() : '-'),
        },
        {
            name: 'Created At',
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => new Date(row.createdAt).toLocaleString(),
        },
    ];

    return (
        <DefaultLayout>
            <div
                className="table-page-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <CRow className="justify-content-center w-100 mx-0">
                    <CCol xs={12}>
                        <div className="invalid-pdfs-container">

                            <CCard className="shadow-sm border-0 rounded-3 custom-card">
                                {/* Title */}
                                <CCardHeader className="p-3">
                                    <CCardTitle className="custom-card-title">Invalid PDFs</CCardTitle>
                                </CCardHeader>

                                {/* Tabs */}
                                <CCardHeader className="custom-card-header p-0">
                                    <CNav variant="tabs" role="tablist" className="nav-fill flex-column flex-md-row">
                                        <CNavItem>
                                            <CNavLink
                                                active={activeKey === 1}
                                                onClick={() => setActiveKey(1)}
                                                className="px-2 px-md-3 text-nowrap"
                                            >
                                                <CIcon icon={cilCalculator} className="me-0 me-md-2" />
                                                Bank Transactions
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink
                                                active={activeKey === 2}
                                                onClick={() => setActiveKey(2)}
                                                className="px-2 px-md-3 text-nowrap"
                                            >
                                                <CIcon icon={cilWallet} className="me-0 me-md-2" />
                                                KIF
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink
                                                active={activeKey === 3}
                                                onClick={() => setActiveKey(3)}
                                                className="px-2 px-md-3 text-nowrap"
                                            >
                                                <CIcon icon={cilFolderOpen} className="me-0 me-md-2" />
                                                KUF
                                            </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink
                                                active={activeKey === 4}
                                                onClick={() => setActiveKey(4)}
                                                className="px-2 px-md-3 text-nowrap"
                                            >
                                                <CIcon icon={cilDescription} className="me-0 me-md-2" />
                                                Contracts
                                            </CNavLink>
                                        </CNavItem>
                                    </CNav>
                                </CCardHeader>

                                <CCardBody className="p-3 p-md-4">
                                    <CTabContent>
                                        <CTabPane visible={activeKey === 1} className="fade">
                                            <DynamicTable columns={logColumns} apiEndpoint={endpoints.bank} />
                                        </CTabPane>
                                        <CTabPane visible={activeKey === 2} className="fade">
                                            <DynamicTable columns={logColumns} apiEndpoint={endpoints.kif} />
                                        </CTabPane>
                                        <CTabPane visible={activeKey === 3} className="fade">
                                            <DynamicTable
                                                columns={logColumns}
                                                apiEndpoint={endpoints.kuf}
                                                onRowClick={handleRowClick}
                                            />
                                        </CTabPane>
                                        <CTabPane visible={activeKey === 4} className="fade">
                                            <DynamicTable
                                                columns={logColumns}
                                                apiEndpoint={endpoints.contracts}
                                                onRowClick={handleRowClick}
                                            />
                                        </CTabPane>
                                    </CTabContent>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                </CRow>

                {/* Modal  */}
                <CModal visible={modalOpen} onClose={() => setModalOpen(false)} size="xl" alignment="center">
                    <CModalHeader>
                        <CModalTitle>{selectedRow?.filename || "Document Details"}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {selectedRow && (
                            <InvalidPdfDetails id={selectedRow.id} type={selectedRow.type} />
                        )}
                    </CModalBody>
                </CModal>
            </div>
        </DefaultLayout>
    );
};

export default InvalidPdfs;
