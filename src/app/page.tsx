"use client"

import { DialogProblems } from "@/components/common/drawer-default"
import { MapFullScreen } from "@/components/map/map-fullscreen"
import { useMenuState } from "@/components/menu/use-menu-state"
import { useProblemReport } from "@/components/problem/use-problem-report"

export default function Home() {
  const { reportMenuOpen, toggleReportMenu } = useMenuState()
  const {
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem,
    userConfirmedProblem,
    resetConfirmation,
  } = useProblemReport()

  return (
    <div className="relative h-screen w-full">
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
