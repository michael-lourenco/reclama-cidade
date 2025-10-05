import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

export const UserStatistics: React.FC = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user?.image) {
      try {
        const cleanPhotoUrl = user.image.split("=")[0]
        setAvatarUrl(`${cleanPhotoUrl}=s150`)
      } catch (error) {
        toast.error("Erro ao carregar avatar do usuário.")
        setAvatarUrl(null)
      }
    } else {
      setAvatarUrl(null)
    }
  }, [user])

  return (
    <>
      {user ? (
        <div className="bg-background rounded-xl p-6 shadow-none">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="bg-background border-none md:col-span-1">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="border-background h-24 w-24 border-4">
                    <AvatarImage
                      src={avatarUrl || "/api/placeholder/150/150"}
                      alt="User avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-background text-foreground">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-chart-2 border-background absolute right-0 -bottom-2 h-4 w-4 rounded-full border-2"></div>
                </div>
                <CardTitle className="text-primary mt-4 text-xl">
                  {user?.name}
                </CardTitle>
                <p className="text-primary text-sm">User Profile</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-3">
              {/* <StatCard
                title="Best Score"
                value={user?.best_score?.value ?? 0}
                icon={Trophy}
                color="bg-amber-500/10 text-amber-500"
              /> */}
              {/* <StatCard
                title="Coins"
                value={user?.currency?.value ?? 0}
                icon={Coins}
                color="bg-emerald-500/10 text-emerald-500"
              />
              <StatCard
                title="Total Games"
                value={user?.total_games?.value ?? 0}
                icon={GamepadIcon}
                color="bg-blue-500/10 text-blue-500"
              /> */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default UserStatistics
