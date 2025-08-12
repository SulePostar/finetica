import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/AppHeader';
import AppSidebar from '../../components/AppSidebar';
import ProfileForm from '../../components/Profile/ProfileForm';
import DefaultLayout from '../../layout/DefaultLayout';

const Profile = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    //   <AppHeader />
    //   <div style={{ display: 'flex', flex: 1 }}>
    //     {isSidebarVisible && <AppSidebar />}
    //     <main style={mainContentStyle}>
    //       <ProfileForm />
    //     </main>
    //   </div>
    // </div>

    <DefaultLayout>
      <ProfileForm />
    </DefaultLayout>

  );
};

export default Profile;
