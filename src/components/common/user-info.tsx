import { UserData } from "@/components/user/types/user";
import { Button } from "@/components/ui/button";
import React from "react";

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  user,
  handleLogin,
}) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-sm">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <div className="flex items-center text-lg font-semibold truncate">
              <span className="text-primary">{user?.displayName ?? 0}</span>
            </div>
          </div>
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
  );
};
