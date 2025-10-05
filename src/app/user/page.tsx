"use client"

import { Footer } from "@/components/common/footer"
import { UserInfo } from "@/components/common/user-info"
import { UserLogout } from "@/components/common/user-logout"
import { Card, CardContent } from "@/components/ui/card"
import UserStatistics from "@/components/user/user-statistics"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function UserDashboard() {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col items-center justify-start pt-4">
        <div className="mx-auto max-w-4xl">
          <UserInfo />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              <>
                <UserStatistics />
                <UserLogout />
              </>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
