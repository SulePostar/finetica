import React, { useEffect, useState } from 'react';
import { AppHeader, AppSidebar } from '../components/index';
import ExampleTable from '../components/Tables/ExampleTable';
import { useColorModes } from '@coreui/react';

const DefaultLayout = () => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (colorMode === 'auto') {
      setColorMode('dark');
    }
  }, [colorMode, setColorMode]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const checkDarkMode = () => {
      const dark = colorMode === 'dark' || (colorMode === 'auto' && media.matches);
      setIsDarkMode(dark);
    };

    checkDarkMode();
    media.addEventListener('change', checkDarkMode);
    return () => media.removeEventListener('change', checkDarkMode);
  }, [colorMode]);

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
