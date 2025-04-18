import { UserData } from "@/components/user/types/user";
import { Button } from "@/components/ui/button";
import React from "react";

interface UserLogoutProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserLogout: React.FC<UserLogoutProps> = ({
  user,
  handleLogout,
}) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="whitespace-nowrap"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
