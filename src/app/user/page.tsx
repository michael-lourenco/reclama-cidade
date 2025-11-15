"use client"

import { Footer } from "@/components/common/footer"
import { UserInfo } from "@/components/common/user-info"
import { UserLogout } from "@/components/common/user-logout"
import { Card, CardContent } from "@/components/ui/card"
import UserStatistics from "@/components/user/user-statistics"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const { user, loading, handleLogout } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col items-center justify-start pt-4">
        <div className="mx-auto max-w-4xl">
          <UserInfo user={user} />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <UserStatistics user={user} />
                  <UserLogout handleLogout={handleLogout} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}