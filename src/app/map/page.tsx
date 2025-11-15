"use client"

import { DialogProblems } from "@/components/common/drawer-default"
import { LoginModal } from "@/components/common/login-modal"
import { MapFullScreen } from "@/components/map/map-fullscreen"
import { useMenuState } from "@/components/menu/use-menu-state"
import { useProblemReport } from "@/components/problem/use-problem-report"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

export default function Home() {
  const { reportMenuOpen, toggleReportMenu } = useMenuState()
  const { user, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const {
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem,
    userConfirmedProblem,
    resetConfirmation,
  } = useProblemReport()

  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleModalOpenChange = (open: boolean) => {
    if (!open && !user) return
    setShowLoginModal(open)
  }

  if (!isMounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Carregando...</p>
          <p className="text-sm text-muted-foreground">Por favor, aguarde enquanto carregamos os recursos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      <LoginModal
        open={showLoginModal}
        onOpenChange={handleModalOpenChange}
      />

      <DialogProblems
        open={reportMenuOpen}
        onOpenChange={(open) => {
          if (!open) toggleReportMenu()
        }}
        selectedProblemType={selectedProblemType}
        handleProblemSelect={handleProblemSelect}
        handleConfirmProblem={handleConfirmProblem}
        onNeedLogin={() => setShowLoginModal(true)}
      />

      <MapFullScreen
        selectedProblemType={selectedProblemType}
        handleProblemSelect={handleProblemSelect}
        handleConfirmProblem={handleConfirmProblem}
        userConfirmedProblem={userConfirmedProblem}
        resetConfirmation={resetConfirmation}
        toggleReportMenu={toggleReportMenu}
        onNeedLogin={() => setShowLoginModal(true)}
      />
    </div>
  )
}