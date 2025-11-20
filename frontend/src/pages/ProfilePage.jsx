import ProfileHeader from '@/components/profilePage/ProfileHeader';
import ProfileAvatarSection from '@/components/profilePage/ProfileAvatarSection';
import React from 'react'
import { Card } from '@/components/ui/card';

const ProfilePage = () => {
  return (
    <main>
      <Card className="w-[65vw] mx-auto p-2 w-full">
        <ProfileHeader />
        <ProfileAvatarSection />
      </Card>
    </main>
  )
}

export default ProfilePage;