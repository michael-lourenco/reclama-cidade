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
  const { user, loading, handleLogin } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const {
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem,
    userConfirmedProblem,
    resetConfirmation,
  } = useProblemReport()

  // Estado para controlar a montagem da página no cliente
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mostra o modal de login somente quando sabemos que o usuário não está autenticado
  // e o componente já está montado no cliente
  useEffect(() => {
    if (isMounted && !loading) {
      setShowLoginModal(!user)
    }
  }, [user, loading, isMounted])

  // Tentativa de fechar o modal: ignoramos se o usuário não está logado
  const handleModalOpenChange = (open: boolean) => {
    // Se estiver tentando fechar e não estiver logado, ignoramos
    if (!open && !user) return
    setShowLoginModal(open)
  }

  // Quando está carregando, mostra um indicador de carregamento
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
      {/* Modal de login - apenas visível se o usuário não estiver logado */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={handleModalOpenChange}
        handleLogin={handleLogin}
        user={user}
      />

      {/* Apenas mostra o conteúdo do mapa se o usuário estiver logado */}
      {user ? (
        <>
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
        </>
      ) : null}
    </div>
  )
}
