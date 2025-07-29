import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/AppHeader';
import AppSidebar from '../../components/AppSidebar';
import ProfileForm from '../../components/Profile/ProfileForm';

const Profile = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth > 991);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const mainContentStyle = {
    padding: '20px',
    paddingLeft: isSidebarVisible && window.innerWidth > 991 ? '255px' : '20px',
    transition: 'padding-left 0.3s ease',
    width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader />
      <div style={{ display: 'flex', flex: 1 }}>
        {isSidebarVisible && <AppSidebar />}
        <main style={mainContentStyle}>
          <ProfileForm />
        </main>
      </div>
    </div>
  );
};

export default Profile;
