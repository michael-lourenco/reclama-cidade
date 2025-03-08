import React from "react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/application/entities/User";
import { Icon } from "./icons";
import { Heart } from "lucide-react";

interface UserLogoutProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserLogout: React.FC<UserLogoutProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const handleDonation = () => {
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null)  ? (
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
