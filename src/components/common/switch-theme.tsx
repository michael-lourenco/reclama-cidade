"use client";

import { useTheme } from "next-themes";

import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="dark-mode" className="cursor-pointer">
        Tema escuro
      </Label>
      <Switch
        id="dark-mode"
        className="cursor-pointer"
        checked={theme === "dark"}
        onCheckedChange={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      />
    </div>
  );
}
