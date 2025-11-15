import { Button } from "@/components/ui/button"
import React from "react"

interface UserLogoutProps {
  handleLogout: () => void
}

export const UserLogout: React.FC<UserLogoutProps> = ({ handleLogout }) => {
  return (
    <div className="text-primary bg-background mb-4 flex flex-col rounded-lg p-4">
      <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="whitespace-nowrap"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}