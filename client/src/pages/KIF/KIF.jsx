import { AppHeader, AppSidebar } from '../../components/index';
import { CContainer } from '@coreui/react';

const KIF = () => {
    return (
        <>
            <AppSidebar />
            <CContainer className="wrapper d-flex flex-column min-vh-100" fluid>
                <AppHeader />
            </CContainer>
        </>
    )
}

export default KIF;
