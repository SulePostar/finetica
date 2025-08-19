import DefaultLayout from '../../layout/DefaultLayout';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/shared/CommonStyles.css';

const AdminDashboard = () => {
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div
                className="table-page-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <div className="table-content-wrapper">
                    <h1>Admin Dashboard</h1>
                    <CContainer className="wrapper d-flex flex-column min-vh-100" fluid>
                        <AppHeader />
                    </CContainer>
                    {/* put your charts / stats / tables here */}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AdminDashboard;
