"use client"
import type React from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { MapFullScreen} from "@/components/map/map-fullscreen"

export default function Home() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth()

  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Logando...</p>
      </div>
    )
  }

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="relative w-full h-screen">
          <MapFullScreen />
        </div>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-baclkground rounded-lg">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button onClick={handleLogin} variant="default">
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
