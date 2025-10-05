"use client"

import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import React from "react"

export const UserLogout: React.FC = () => {
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status !== "authenticated") {
    return null
  }

  return (
    <div className="text-primary bg-background mb-4 flex flex-col rounded-lg p-4">
      <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="whitespace-nowrap"
        >
          Sair
        </Button>
      </div>
    </div>
  )
}
