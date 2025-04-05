"use client";
import { DialogProblems } from "@/components/common/drawer-default";
// import { DrawerDialogDemo } from "@/components/common/drawer-default";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Locate, MapPin } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
// import { DrawerDialogDemo } from "@/components/common/drawer-default";

interface LocationControlsProps {
  centerOnUserLocation: () => void;
  toggleReportMenu: () => void;
  followMode: boolean;
  toggleFollowMode: () => void;
}

const LocationControls = ({
  centerOnUserLocation,
  toggleReportMenu,
  followMode,
  toggleFollowMode,
}: LocationControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[9999]">
      {/*
        <DrawerDialogDemo /> 
      */}
      
      {/* <DialogProblems
        title="Testes"
        description="Subdescriçao"
        onCancel={() => alert("oi")}
        onSubmit={() => alert("oi")}
      >
        <AlertTriangle />
      </DialogProblems> */}
      <Button
        variant={followMode ? "default" : "floating"}
        size="icon"
        className={`shadow-md rounded-full h-12 w-12 ${
          followMode ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
        }`}
        title={followMode ? "Desativar centralização automática" : "Ativar centralização automática"}
        onClick={toggleFollowMode}
      >
        {followMode ? <MapPin /> : <Locate />}
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
