"use client"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Locate, MapPin } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"

interface LocationControlsProps {
  centerOnUserLocation: () => void
  followMode: boolean
  toggleFollowMode: () => void
  toggleReportMenu: () => void
}

const LocationControls = ({
  centerOnUserLocation,
  followMode,
  toggleFollowMode,
  toggleReportMenu,
}: LocationControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[9999]">
      <Button
        variant={followMode ? "default" : "floating"}
        size="icon"
        className={`shadow-md rounded-full h-12 w-12 ${followMode ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
        title={followMode ? "Desativar centralização automática" : "Ativar centralização automática"}
        onClick={centerOnUserLocation} // This button should call centerOnUserLocation
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
  )
}

export { LocationControls }

