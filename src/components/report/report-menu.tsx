"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { PROBLEM_TYPES } from "@/constants/map-constants"

interface ReportMenuProps {
    reportMenuOpen: boolean;
    toggleReportMenu: () => void;
    selectedProblemType: string | null;
    handleProblemSelect: (problemType: string) => void;
    handleConfirmProblem: () => void;
}

const ReportMenu: React.FC<ReportMenuProps> = ({
    reportMenuOpen,
    toggleReportMenu,
    selectedProblemType,
    handleProblemSelect,
    handleConfirmProblem
    }) => {
    if (!reportMenuOpen) return null;

    return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-20 p-4">
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Reportar Problema</h3>
        <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
            <X className="h-5 w-5" />
        </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
        <div
            className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.BURACO ? "bg-gray-100" : ""}`}
            onClick={() => handleProblemSelect(PROBLEM_TYPES.BURACO)}
        >
            <div className="bg-red-100 p-2 rounded-full mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-xs">Buraco</span>
        </div>
        <div
            className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.ALAGAMENTO ? "bg-gray-100" : ""}`}
            onClick={() => handleProblemSelect(PROBLEM_TYPES.ALAGAMENTO)}
        >
            <div className="bg-yellow-100 p-2 rounded-full mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="text-xs">Alagamento</span>
        </div>
        <div
            className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.ILUMINACAO ? "bg-gray-100" : ""}`}
            onClick={() => handleProblemSelect(PROBLEM_TYPES.ILUMINACAO)}
        >
            <div className="bg-blue-100 p-2 rounded-full mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-xs">Iluminação</span>
        </div>
        </div>
        <Button className="w-full" disabled={!selectedProblemType} onClick={handleConfirmProblem}>
        Confirmar Problema
        </Button>
    </div>
    )
}

export { ReportMenu }