import { AppHeader, AppSidebar } from '../components/index';
import { CContainer } from '@coreui/react';
import KifTable from '../components/Tables/KIFTable';

const DefaultLayout = () => {
  return (
    <>
      <AppSidebar />
      <CContainer className="wrapper d-flex flex-column min-vh-100" fluid>
        <AppHeader />
        <KifTable />
      </CContainer>
    </>
  );
};

export default DefaultLayout;
