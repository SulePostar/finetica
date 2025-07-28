import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppSidebar from '../../components/AppSidebar';
import ProfileForm from '../../components/Profile/ProfileForm';

const Profile = () => {
  return (
    <div>
      <AppHeader />
      <AppSidebar />
      <main
        style={{
          display: 'flex',
          width: '100%',
          padding: '20px',
          paddingLeft: '255px',
        }}
      >
        <ProfileForm />
      </main>
    </div>
  );
};

export default Profile;