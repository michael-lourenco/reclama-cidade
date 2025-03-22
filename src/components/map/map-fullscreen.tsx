
"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import {
  PROBLEM_TYPES,
}from "@/constants/map-constants"

import { MapContent} from "@/components/map/map-content"

const MapFullScreen = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isClient, setIsClient] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [reportMenuOpen, setReportMenuOpen] = useState(false)
    const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null)
    const [userConfirmedProblem, setUserConfirmedProblem] = useState(false)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const locationWatchId = useRef<number | null>(null)

    useEffect(() => {
        setIsClient(true)

        // Iniciar monitoramento da localização com alta precisão
        if ("geolocation" in navigator) {
        locationWatchId.current = navigator.geolocation.watchPosition(
            (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation([latitude, longitude])
            },
            (error) => {
            console.error("Erro ao obter localização:", error)
            },
            {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
            },
        )
        }

        return () => {
        if (locationWatchId.current !== null) {
            navigator.geolocation.clearWatch(locationWatchId.current)
        }
        }
    }, [])

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        if (reportMenuOpen) setReportMenuOpen(false)
    }

    const toggleReportMenu = () => {
        if (!userLocation) {
        alert("É necessário permitir o acesso à sua localização para reportar um problema.")
        return
        }
        setReportMenuOpen(!reportMenuOpen)
    }

    const handleProblemSelect = (problemType: string) => {
        setSelectedProblemType(problemType)
    }

    const handleConfirmProblem = () => {
        if (!userLocation) {
        alert("É necessário permitir o acesso à sua localização para reportar um problema.")
        return
        }
        setUserConfirmedProblem(true)
        setReportMenuOpen(false)
    }

    useEffect(() => {
        if (userConfirmedProblem) {
        const timer = setTimeout(() => {
            setUserConfirmedProblem(false)
        }, 500)
        return () => clearTimeout(timer)
        }
    }, [userConfirmedProblem])

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
            userLocation={userLocation}
            />
        )}

        {/* Bottom Right - Report Problem Button */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
            <Button
            variant="default"
            size="icon"
            className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12"
            title="Reportar problema"
            onClick={toggleReportMenu}
            >
            <AlertTriangle className="h-5 w-5" />
            </Button>
        </div>

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
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Configurações</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Ajuda</li>
                </ul>
            </div>
            </div>
        )}

        {/* Report Problem Menu */}
        {reportMenuOpen && (
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-20 p-4 pb-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Reportar Problema</h3>
                <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
                <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Problem type buttons */}
                {Object.entries(PROBLEM_TYPES).map(([key, value]) => (
                <div
                    key={key}
                    className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === value ? "bg-gray-100" : ""}`}
                    onClick={() => handleProblemSelect(value)}
                >
                    <div
                    className={`bg-${value === PROBLEM_TYPES.BURACO ? "red" : value === PROBLEM_TYPES.ALAGAMENTO ? "yellow" : "blue"}-100 p-2 rounded-full mb-2`}
                    >
                    <AlertTriangle
                        className={`h-5 w-5 text-${value === PROBLEM_TYPES.BURACO ? "red" : value === PROBLEM_TYPES.ALAGAMENTO ? "yellow" : "blue"}-500`}
                    />
                    </div>
                    <span className="text-xs">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                </div>
                ))}
            </div>
            <div className="sticky bottom-0 pt-2 pb-4 bg-white">
                <Button className="w-full text-black" disabled={!selectedProblemType} onClick={handleConfirmProblem}>
                Confirmar Problema
                </Button>
            </div>
            </div>
        )}

        {!userLocation && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm text-red-500">
                Ative a localização para reportar problemas
            </div>
            </div>
        )}
        </>
    )
}

export {MapFullScreen}
