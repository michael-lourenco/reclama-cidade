"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ToggleTheme } from "../toggle-theme";

interface TopMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const TopMenu = ({ menuOpen, toggleMenu }: TopMenuProps) => {
  return (
    <>
      {/* Toggle Menu Button */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
        <Button
          variant="floating"
          size="icon"
          onClick={toggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-full w-64 bg-background shadow-lg z-20 transition-all">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Mapa de Problemas</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              <li className="p-2 cursor-pointer">Meus Reportes</li>
              <li className="p-2 cursor-pointer">Configurações</li>
              <li className="p-2 cursor-pointer">Ajuda</li>
            </ul>
          </div>
          <ToggleTheme />
        </div>
      )}
    </>
  );
};

export { TopMenu };

