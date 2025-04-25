"use client"
import { TProblemType } from "@/constants/map-constants"
import { useClientState } from "@/hooks/use-client-state"
import type React from "react"
import { useCallback, useState } from "react"
import { MapContent } from "./map-content"

interface MapFullScreenProps {
  selectedProblemType: TProblemType | undefined
  handleProblemSelect: (problemType: TProblemType) => void
  handleConfirmProblem: () => void
  userConfirmedProblem: boolean
  resetConfirmation: () => void
  toggleReportMenu: () => void // Pass the toggleReportMenu function as a prop {toggleReportMenu}
}
const MapFullScreen: React.FC<MapFullScreenProps> = ({
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu,
}) => {
  const { isLoading, setIsLoading, isClient } = useClientState()

  // Add state for selected filter types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // Use useCallback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((types: string[]) => {
    setSelectedTypes(types)
  }, [])

  return (
    <>
      {!isClient || isLoading ? (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
          <span className="text-gray-500">Carregando mapa...</span>
        </div>
      ) : null}

      {isClient && (
        <MapContent
          setIsLoading={setIsLoading}
          selectedProblemType={selectedProblemType}
          userConfirmedProblem={userConfirmedProblem}
          resetConfirmation={resetConfirmation}
          toggleReportMenu={toggleReportMenu}
          selectedTypes={selectedTypes}
          onFilterChange={handleFilterChange}
        />
      )}
    </>
  )
}

export { MapFullScreen }

