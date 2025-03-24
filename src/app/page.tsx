"use client";

import { LocationControls } from "@/components/location-controls/location-controls";
import { MapFullScreen } from "@/components/map/map-fullscreen";
import { TopMenu } from "@/components/menu/top-menu";
import { ReportMenu } from "@/components/report/report-menu";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useMenuState } from "@/hooks/use-menu-state";
import { useProblemReport } from "@/hooks/use-problem-report";

export default function Home() {
  const { menuOpen, reportMenuOpen, toggleMenu, toggleReportMenu } =
    useMenuState();
  const { centerOnUserLocation } = useGeolocation();
  const {
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem,
    userConfirmedProblem,
    resetConfirmation,
  } = useProblemReport();

  return (
    <div className="relative w-full h-screen">
      {/* Top Menu Component */}
      <TopMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

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
      {/* Map Component */}
      <MapFullScreen
        selectedProblemType={selectedProblemType}
        handleProblemSelect={handleProblemSelect}
        handleConfirmProblem={handleConfirmProblem}
        userConfirmedProblem={userConfirmedProblem}
        resetConfirmation={resetConfirmation}
      />
    </div>
  );
}
