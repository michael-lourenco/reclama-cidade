// map-fullscreen.tsx
"use client"
import type React from "react"
import { MapContent } from "./map-content"
import { ReportMenu } from "@/components/report/report-menu"
import { LocationControls } from "../location-controls/location-controls"
import { TopMenu } from "@/components/menu/top-menu"
import { useClientState } from "@/hooks/useClientState"
import { useMenuState } from "@/hooks/useMenuState"
import { useProblemReport } from "@/hooks/useProblemReport"
import { useGeolocation } from "@/hooks/useGeolocation"

const MapFullScreen = () => {
    const { isLoading, setIsLoading, isClient } = useClientState()
    const { menuOpen, reportMenuOpen, toggleMenu, toggleReportMenu } = useMenuState()
    const {
        selectedProblemType,
        userConfirmedProblem,
        handleProblemSelect,
        handleConfirmProblem,
        resetConfirmation
    } = useProblemReport()
    const { centerOnUserLocation } = useGeolocation()

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

        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm">
                Clique no mapa para selecionar uma localização
            </div>
        </div>
    </>
    )
}

export { MapFullScreen }