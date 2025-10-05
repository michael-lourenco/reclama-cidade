"use client"

import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import React from "react"

export const UserInfo: React.FC = () => {
  const { data: session, status } = useSession()

  const handleLogin = async () => {
    await signIn("google")
  }

  if (status === "loading") {
    return (
      <div className="text-primary bg-background mb-4 flex animate-pulse flex-col rounded-sm p-4">
        <div className="h-6 w-32 rounded bg-gray-300"></div>
      </div>
    )
  }

  return (
    <>
      {session?.user ? (
        <div className="text-primary bg-background mb-4 flex flex-col rounded-sm p-4">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <div className="flex items-center truncate text-lg font-semibold">
              <span className="text-primary">{session.user.name}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-primary bg-background mb-4 flex flex-col rounded-lg p-4">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button onClick={handleLogin}>Entrar com Google</Button>
          </div>
        </div>
      )}
    </>
  )
}