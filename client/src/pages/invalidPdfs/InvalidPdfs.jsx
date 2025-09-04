import { useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CRow,
    CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCalculator, cilWallet, cilFolderOpen, cilDescription } from "@coreui/icons";
import DefaultLayout from "../../layout/DefaultLayout";
import './InvalidPdfs.css';
import { useSidebarWidth } from "../../hooks/useSidebarWidth";

const InvalidPdfs = () => {
    const [activeKey, setActiveKey] = useState(1);
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div className="table-page-outer d-flex justify-content-center align-items-start align-items-md-center py-3 py-md-0"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}>
                <CRow className="justify-content-center w-100 mx-0">
                    <CCol xs={12} sm={8} md={10} lg={10} xl={12}>
                        <CCard className="shadow-sm border-0 rounded-3 custom-card">
                            <CCardHeader className="custom-card-header p-0">
                                <CNav variant="tabs" role="tablist" className="nav-fill flex-nowrap overflow-auto">
                                    <CNavItem>
                                        <CNavLink
                                            active={activeKey === 1}
                                            onClick={() => setActiveKey(1)}
                                            className="px-2 px-md-3 text-nowrap"
                                        >
                                            <CIcon icon={cilCalculator} className="me-0 me-md-2" />
                                            <span className="d-none d-sm-inline">Bank Transactions</span>
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeKey === 2}
                                            onClick={() => setActiveKey(2)}
                                            className="px-2 px-md-3 text-nowrap"
                                        >
                                            <CIcon icon={cilWallet} className="me-0 me-md-2" />
                                            <span className="d-none d-sm-inline">KIF</span>
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeKey === 3}
                                            onClick={() => setActiveKey(3)}
                                            className="px-2 px-md-3 text-nowrap"
                                        >
                                            <CIcon icon={cilFolderOpen} className="me-0 me-md-2" />
                                            <span className="d-none d-sm-inline">KUF</span>
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeKey === 4}
                                            onClick={() => setActiveKey(4)}
                                            className="px-2 px-md-3 text-nowrap"
                                        >
                                            <CIcon icon={cilDescription} className="me-0 me-md-2" />
                                            <span className="d-none d-sm-inline">Contracts</span>
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                            </CCardHeader>
                            <CCardBody className="p-3 p-md-4">
                                <CTabContent>
                                    <CTabPane visible={activeKey === 1} className="fade">
                                        <p>Here you can view and manage your bank transactions.</p>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 2} className="fade">
                                        <p>Details and management of KIF.</p>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 3} className="fade">
                                        <p>Details and management of KUF.</p>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 4} className="fade">
                                        <p>List and manage contracts here.</p>
                                    </CTabPane>
                                </CTabContent>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </div>
        </DefaultLayout>
    );
};

export default InvalidPdfs;