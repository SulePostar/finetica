import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CardContent, CardDescription, CardTitle } from '../ui/card'

const ProfileAvatarSection = () => {
  return (
    <CardContent>
      <div className="flex items-center w-full flex-wrap gap-6">
        <div className="">
          <Avatar className="h-24 w-24 lg:h-48 lg:w-48 md:h-42 md:w-42 sm:h-32 sm:w-32">
            <AvatarImage src=""></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <CardTitle className="lg:text-4xl md:text-2xl sm:text-xl">
            <h2 className="inline">Name Surname</h2>
            <span className="inline ml-2 text-sm opacity-70">(role)</span>
          </CardTitle>

          <CardDescription>
            <p className="text-base">john.doe@example.com</p>
            <span className="text-xs">Last login: DD:MM:YYYY hh:mm</span>
          </CardDescription>
        </div>
      </div>
    </CardContent>
  )
}

export default ProfileAvatarSection