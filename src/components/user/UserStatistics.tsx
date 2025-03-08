import React, { useEffect, useState } from "react";
import { UserData } from "@/services/auth/NextAuthenticationService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Coins, GamepadIcon } from "lucide-react";

interface UserStatisticsProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserStatistics: React.FC<UserStatisticsProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const localStorageUser = localStorage.getItem("user") != null ? localStorage.getItem("user"): {};
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      try {
        const cleanPhotoUrl = user.photoURL.split("=")[0];
        setAvatarUrl(`${cleanPhotoUrl}=s150`);
      } catch (error) {
        console.error("Erro ao formatar a URL da imagem:", error);
        setAvatarUrl(null);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <Card className="bg-background border-none hover:bg-background transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-primary">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-primary">{value}</div>
          <div className="text-xs text-primary">
            {title === "Best Score" && "Personal Record"}
            {title === "Coins" && "Available Balance"}
            {title === "Total Games" && "Games Played"}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="p-6 bg-background rounded-xl shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 bg-background border-none">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage
                      src={avatarUrl || "/api/placeholder/150/150"}
                      alt="User avatar" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-background">
                      {user?.displayName?.charAt(0) || 'MP'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 right-0 bg-chart-2 w-4 h-4 rounded-full border-2 border-background"></div>
                </div>
                <CardTitle className="mt-4 text-primary text-xl">
                  {user?.displayName}
                </CardTitle>
                <p className="text-sm text-primary">User Profile</p>
              </CardHeader>
            </Card>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
};

export default UserStatistics;