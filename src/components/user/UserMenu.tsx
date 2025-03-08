import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserMenuButton } from "./UserMenuButton";
import { Icon } from "@/components/icons";

export interface UserMenuProps {
  onPlay: () => void;
  onHowToPlay: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onPlay,
  onHowToPlay,
}) => (
  <Card className="bottom-0 left-0 right-0 bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <UserMenuButton
        label={<><Icon name="LuPlay" size={24} /> Jogar</>}
        onClick={onPlay}
      />
      <UserMenuButton
        label={<><Icon name="LuInfo" size={24} /> Aprender</>}
        onClick={onHowToPlay}
      />
    </CardContent>
  </Card>
);

export default UserMenu;
