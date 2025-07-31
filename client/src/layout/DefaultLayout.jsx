import { AppHeader, AppSidebar } from '../components/index';
import ExampleTable from '../components/Tables/ExampleTable';
import { useColorModes } from '@coreui/react';

const DefaultLayout = () => {
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = colorMode === 'dark' || (colorMode === 'auto' && prefersDark);

  return (
    <div className="d-flex flex-row min-vh-100 bg-light dark:bg-dark">
      <AppSidebar isDarkMode={isDarkMode} />
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