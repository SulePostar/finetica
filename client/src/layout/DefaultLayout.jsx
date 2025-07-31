import { AppHeader, AppSidebar } from '../components/index';
import ExampleTable from '../components/Tables/ExampleTable';

const DefaultLayout = () => {
  return (
    <div className="d-flex flex-row min-vh-100 bg-light dark:bg-dark">
      <AppSidebar />
      <div className="wrapper d-flex flex-column flex-grow-1">
        <AppHeader />
        <main className="p-3 flex-grow-1">
          <ExampleTable />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
