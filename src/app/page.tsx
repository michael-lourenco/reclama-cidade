"use client"
import type React from "react"
import { ReportMenu } from "@/components/report/report-menu"
import { LocationControls } from "@/components/location-controls/location-controls"
import { TopMenu } from "@/components/menu/top-menu"
import { useMenuState } from "@/hooks/useMenuState"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useProblemReport } from "@/hooks/useProblemReport"
import { MapFullScreen } from "@/components/map/map-fullscreen"


export default function Home() {
  const { menuOpen, reportMenuOpen, toggleMenu, toggleReportMenu } = useMenuState()
  const { centerOnUserLocation } = useGeolocation()
  const {
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem,
    userConfirmedProblem,
    resetConfirmation
  } = useProblemReport()

  return (
    <div className="relative w-full h-screen">
      {/* Top Menu Component */}
      <TopMenu 
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
      />

      {/* Location Controls Component */}
      <LocationControls 
          centerOnUserLocation={centerOnUserLocation}
          toggleReportMenu={toggleReportMenu}
      />

      {/* Report Problem Menu */}
      <ReportMenu
          reportMenuOpen={reportMenuOpen}
          toggleReportMenu={toggleReportMenu}
          selectedProblemType={selectedProblemType}
          handleProblemSelect={handleProblemSelect}
          handleConfirmProblem={handleConfirmProblem}
      />
      <MapFullScreen 
        selectedProblemType={selectedProblemType}
        handleProblemSelect={handleProblemSelect}
        handleConfirmProblem={handleConfirmProblem}
        userConfirmedProblem={userConfirmedProblem}
        resetConfirmation={resetConfirmation}
      />
    </div>
  )
}
