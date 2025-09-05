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
    CCardText,
    CCardTitle
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
            <div
                className="table-page-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                    padding: '20px 60px',
                }}
            >
                <CRow className="justify-content-center w-100 mx-0">
                    <CCol xs={12} sm={10} lg={12}>
                        <CCard className="shadow-sm border-0 rounded-3 custom-card">
                            {/* Title */}
                            <CCardHeader className="p-3">
                                <CCardTitle className="custom-card-title">Invalid PDFs</CCardTitle>
                            </CCardHeader>

                            {/* Tabs */}
                            <CCardHeader className="custom-card-header p-0">
                                <CNav variant="tabs" role="tablist" className="nav-fill flex-nowrap overflow-auto">
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
                                        <CCardText>List and manage bank transactions here.</CCardText>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 2} className="fade">
                                        <CCardText>List and manage KIF here.</CCardText>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 3} className="fade">
                                        <CCardText>List and manage KUF here.</CCardText>
                                    </CTabPane>
                                    <CTabPane visible={activeKey === 4} className="fade">
                                        <CCardText>List and manage contracts here.</CCardText>
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
