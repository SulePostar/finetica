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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InvalidPdfDetails } from '../../components/InvalidPdfDetails/InvalidPdfDetails';
import DynamicTable from '../../components/Tables/DynamicTable';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import DefaultLayout from '../../layout/DefaultLayout';
import './InvalidPdfs.css';

const InvalidPdfs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sidebarWidth = useSidebarWidth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const endpoints = {
    bank: `${API_BASE}/transactions/logs/invalid`,
    kif: `${API_BASE}/kif/logs/invalid`,
    kuf: `${API_BASE}/kuf/logs/invalid`,
    contracts: `${API_BASE}/contracts/logs/invalid`,
  };

  const initialTab = Number(searchParams.get('tab')) || 1;
  const [activeKey, setActiveKey] = useState(initialTab);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow({ ...row, type: activeKey });
    setModalOpen(true);
  };

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeKey });
  }, [activeKey, setSearchParams]);

  const logColumns = [
    {
      name: 'File Name',
      selector: (row) => row.filename || '—',
      sortable: true,
      wrap: true,
      minWidth: '200px',
      maxWidth: '300px',
    },
    {
      name: 'Message',
      selector: (row) => row.message || '—',
      sortable: false,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Status',
      selector: (row) => row.isValid,
      sortable: true,
      minWidth: '120px',
      grow: 0,
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
      minWidth: '150px',
      grow: 0,
      cell: (row) =>
        row.isProcessed ? <CBadge color="success">Yes</CBadge> : <CBadge color="danger">No</CBadge>,
    },
    {
      name: 'Processed At',
      selector: (row) => row.processedAt || '—',
      sortable: true,
      minWidth: '180px',
      grow: 0,
      cell: (row) => (row.processedAt ? new Date(row.processedAt).toLocaleString() : '—'),
    },
    {
      name: 'Created At',
      selector: (row) => row.createdAt,
      sortable: true,
      minWidth: '160px',
      grow: 0,
      cell: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'),
    },
  ];

  const getNoDataMessage = (tabKey) => {
    switch (tabKey) {
      case 1:
        return 'There are no bank transaction records to display';
      case 2:
        return 'There are no KIF records to display';
      case 3:
        return 'There are no KUF records to display';
      case 4:
        return 'There are no contract records to display';
      default:
        return 'There are no records to display';
    }
  };

  return (
    <DefaultLayout>
      <div
        className="table-page-outer"
        style={{
          left: sidebarWidth + 24,
          right: 24,
        }}
      >
        <div className="invalid-pdfs-scroll">
          <CRow className="justify-content-center w-100 mx-0">
            <CCol xs={12}>
              <div className="invalid-pdfs-container">
                <CCard className="shadow-sm border-0 rounded-3 custom-card">
                  <CCardHeader className="p-3">
                    <CCardTitle className="custom-card-title">Invalid PDFs</CCardTitle>
                  </CCardHeader>

                  <CCardHeader className="custom-card-header p-0 sticky-tabs">
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

                  <CCardBody className="p-3 p-md-4 rounded-bottom">
                    <CTabContent>
                      <CTabPane visible={activeKey === 1} className="fade">
                        <DynamicTable
                          columns={logColumns}
                          apiEndpoint={endpoints.bank}
                          onRowClick={handleRowClick}
                          noDataComponent={<div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>{getNoDataMessage(1)}</div>}
                        />
                      </CTabPane>
                      <CTabPane visible={activeKey === 2} className="fade">
                        <DynamicTable
                          columns={logColumns}
                          apiEndpoint={endpoints.kif}
                          onRowClick={handleRowClick}
                          noDataComponent={<div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>{getNoDataMessage(2)}</div>}
                        />
                      </CTabPane>
                      <CTabPane visible={activeKey === 3} className="fade">
                        <DynamicTable
                          columns={logColumns}
                          apiEndpoint={endpoints.kuf}
                          onRowClick={handleRowClick}
                          noDataComponent={<div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>{getNoDataMessage(3)}</div>}
                        />
                      </CTabPane>
                      <CTabPane visible={activeKey === 4} className="fade">
                        <DynamicTable
                          columns={logColumns}
                          apiEndpoint={endpoints.contracts}
                          onRowClick={handleRowClick}
                          noDataComponent={<div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>{getNoDataMessage(4)}</div>}
                        />
                      </CTabPane>
                    </CTabContent>
                  </CCardBody>
                </CCard>
              </div>
            </CCol>
          </CRow>
        </div>
      </div>

      <CModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        alignment="center"
        className="pdf-modal"
      >
        <CModalHeader>
          <CModalTitle>{selectedRow?.filename || 'Document Details'}</CModalTitle>
        </CModalHeader>
        <CModalBody>{selectedRow && <InvalidPdfDetails id={selectedRow.id} type={selectedRow.type} />}</CModalBody>
      </CModal>
    </DefaultLayout>
  );
};

export default InvalidPdfs;
