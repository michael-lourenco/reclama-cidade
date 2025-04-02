"use client";
import { DialogProblems } from "@/components/common/drawer-default";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Locate } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

interface LocationControlsProps {
  centerOnUserLocation: () => void;
  toggleReportMenu: () => void;
}

const LocationControls = ({
  centerOnUserLocation,
  toggleReportMenu,
}: LocationControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[9999]">
      <DialogProblems
        title="Testes"
        description="Subdescriçao"
        onCancel={() => alert("oi")}
        onSubmit={() => alert("oi")}
      >
        Teste
      </DialogProblems>
      <Button
        variant="floating"
        size="icon"
        className="shadow-md rounded-full h-12 w-12"
        title="Usar minha localização"
        onClick={centerOnUserLocation}
      >
        <Locate />
      </Button>
      <Button
        variant="floating"
        size="icon"
        className="shadow-md rounded-full h-12 w-12"
        title="Reportar problema"
        onClick={toggleReportMenu}
      >
        <AlertTriangle />
      </Button>
      <SidebarTrigger />
    </div>
  );
};

export { LocationControls };

