import React from 'react'
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';

const ProfileHeader = () => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between w-full">
        <div>
          <CardTitle className="lg:text-2xl md:text-xl sm:text-xl text-lg">User Profile</CardTitle>
          <CardDescription className="lg:text-base md:text-base">View and manage your profile</CardDescription>
        </div>

        <Button><Pencil className="h-4 w-4" /></Button>
      </div>
    </CardHeader>
  )
}

export default ProfileHeader;