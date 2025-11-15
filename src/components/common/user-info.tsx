import { User } from "@supabase/supabase-js"
import React from "react"

interface UserInfoProps {
  user: User | null
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <>
      {user && (
        <div className="text-primary bg-background mb-4 flex flex-col rounded-sm p-4">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <div className="flex items-center truncate text-lg font-semibold">
              <span className="text-primary">{user?.user_metadata.name}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}