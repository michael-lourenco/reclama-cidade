"use client";

import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { UserInfo } from "@/components/user-info";
import { UserLogout } from "@/components/user-logout";
import UserStatistics from "@/components/user/user-statistics";
import { useAuth } from "@/hooks/use-auth";

export default function UserDashboard() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                <>
                  <UserStatistics
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                  <UserLogout
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
