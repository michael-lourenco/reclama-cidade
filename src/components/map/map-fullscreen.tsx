// map-fullscreen.tsx
"use client"
import type React from "react"
import { MapContent } from "./map-content"

import { useClientState } from "@/hooks/useClientState"

interface MapFullScreenProps {
    selectedProblemType: string | null;
    handleProblemSelect: (problemType: string) => void;
    handleConfirmProblem: () => void;
    userConfirmedProblem: boolean;
    resetConfirmation: () => void;
}
const MapFullScreen: React.FC<MapFullScreenProps> = ({
    selectedProblemType,
    userConfirmedProblem,
    resetConfirmation
    }) => {
    const { isLoading, setIsLoading, isClient } = useClientState()

    return (
    <>
        {!isClient || isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Carregando mapa...</span>
        </div>
        ) : null}

        {isClient && (
        <MapContent
            setIsLoading={setIsLoading}
            selectedProblemType={selectedProblemType}
            userConfirmedProblem={userConfirmedProblem}
            resetConfirmation={resetConfirmation}
        />
        )}


        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm">
                Clique no mapa para selecionar uma localização
            </div>
        </div>
    </>
    )
}

export { MapFullScreen }
