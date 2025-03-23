"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Locate, AlertTriangle } from "lucide-react"

interface LocationControlsProps {
  centerOnUserLocation: () => void
  toggleReportMenu: () => void
}

const LocationControls = ({ centerOnUserLocation, toggleReportMenu }: LocationControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
      <Button
        variant="default"
        size="icon"
        className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12"
        title="Usar minha localização"
        onClick={centerOnUserLocation}
      >
        <Locate className="h-5 w-5" />
      </Button>
      <Button
        variant="default"
        size="icon"
        className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12"
        title="Reportar problema"
        onClick={toggleReportMenu}
      >
        <AlertTriangle className="h-5 w-5" />
      </Button>
    </div>
  )
}

export { LocationControls }