import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/AppHeader';
import AppSidebar from '../../components/AppSidebar';
import ProfileForm from '../../components/Profile/ProfileForm';
import DefaultLayout from '../../layout/DefaultLayout';

const Profile = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <DefaultLayout>
      <ProfileForm />
    </DefaultLayout>
  );
};

export default Profile;
