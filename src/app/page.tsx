"use client"

import { MapFullScreen } from "@/components/map/map-fullscreen"
import { TopMenu } from "@/components/menu/top-menu"
import { DialogProblems } from "@/components/common/drawer-default"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useMenuState } from "@/hooks/use-menu-state"
import { useProblemReport } from "@/hooks/use-problem-report"

export default function Home() {
  const { menuOpen, reportMenuOpen, toggleMenu, toggleReportMenu } = useMenuState()
  const { centerOnUserLocation } = useGeolocation()
  const { selectedProblemType, handleProblemSelect, handleConfirmProblem, userConfirmedProblem, resetConfirmation } =
    useProblemReport()

  return (
    <div className="relative w-full h-screen">
      <TopMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <DialogProblems
        open={reportMenuOpen}
        onOpenChange={(open) => {
          if (!open) toggleReportMenu()
        }}
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
        toggleReportMenu={toggleReportMenu}
      />
    </div>
  )
}

