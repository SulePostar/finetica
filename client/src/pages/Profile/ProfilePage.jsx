import React from 'react';
import AppSidebar from '../../components/AppSidebar';
import ProfileForm from '../../components/Profile/ProfileForm';

const Profile = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f6fa' }}>
        <ProfileForm />
      </main>
    </div>
  );
};

export default Profile;
