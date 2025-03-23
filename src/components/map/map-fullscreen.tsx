"use client"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { MapContent } from "./map-content"
import { ReportMenu } from "@/components/report/report-menu"
import { LocationControls } from "../location-controls/location-controls"
import { TopMenu } from "@/components/menu/top-menu"

const MapFullScreen = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isClient, setIsClient] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [reportMenuOpen, setReportMenuOpen] = useState(false)
    const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null)
    const [userConfirmedProblem, setUserConfirmedProblem] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        if (reportMenuOpen) setReportMenuOpen(false)
    }

    const toggleReportMenu = () => {
        setReportMenuOpen(!reportMenuOpen)
    }

    const handleProblemSelect = (problemType: string) => {
        setSelectedProblemType(problemType)
    }

    const handleConfirmProblem = () => {
        setUserConfirmedProblem(true)
        setReportMenuOpen(false)
    }

    // Reset confirmation state after it's been processed
    useEffect(() => {
        if (userConfirmedProblem) {
            // This will be reset by the child component after processing
            const timer = setTimeout(() => {
                setUserConfirmedProblem(false)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [userConfirmedProblem])

    const centerOnUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    // We'll use a custom event to communicate with the MapContent component
                    const event = new CustomEvent("centerOnUser", {
                        detail: { lat: latitude, lng: longitude },
                    })
                    document.dispatchEvent(event)
                },
                (error) => {
                    console.error("Erro ao obter localização do usuário:", error)
                },
            )
        }
    }

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
                    resetConfirmation={() => setUserConfirmedProblem(false)}
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