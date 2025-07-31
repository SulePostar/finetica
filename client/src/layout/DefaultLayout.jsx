import { AppHeader, AppSidebar } from '../components/index';
import KIFExampleTable from '../components/Tables/KIFExampleTable';

const DefaultLayout = () => {
  return (
    <div className="d-flex flex-row min-vh-100 bg-light dark:bg-dark">
      <AppSidebar />
      <div className="wrapper d-flex flex-column flex-grow-1">
        <AppHeader />
        <main className="p-3 flex-grow-1">
          <KIFExampleTable />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
