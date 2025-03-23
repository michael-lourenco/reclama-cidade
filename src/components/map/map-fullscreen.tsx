"use client"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MapContent } from "./map-content"
import { ReportMenu } from "@/components/report/report-menu"
import { LocationControls } from "../location-controls/location-controls"

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

            {/* Top Bar - Search */}
            <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
                <Button
                    variant="default"
                    size="icon"
                    className="bg-white text-black hover:bg-gray-100 shadow-md"
                    onClick={toggleMenu}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Pesquisar localização..."
                        className="w-full bg-white shadow-md pr-10"
                        onKeyDown={(e) => e.key === "Enter" && console.log("search")}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
    
            {/* Location Controls Component */}
            <LocationControls 
            centerOnUserLocation={centerOnUserLocation}
            toggleReportMenu={toggleReportMenu}
            />

            {/* Side Menu */}
            {menuOpen && (
                <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transition-all">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-bold text-lg">Mapa de Problemas</h2>
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-2">
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Meus Reportes</li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Configurações</li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Ajuda</li>
                        </ul>
                    </div>
                </div>
            )}

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
