"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserInfo } from "@/components/UserInfo";
import { UserStatistics } from "@/components/user/UserStatistics";
import { useNavigation } from "@/hooks/useNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { UserLogout } from "@/components/UserLogout";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
