// useProblemReport.ts
"use client"
import { useEffect, useState } from "react"

export function useProblemReport() {
    const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null)
    const [userConfirmedProblem, setUserConfirmedProblem] = useState(false)

    const handleProblemSelect = (problemType: string) => {
        setSelectedProblemType(problemType)
    }

    const handleConfirmProblem = () => {
        setUserConfirmedProblem(true)
    }

    const resetConfirmation = () => {
        setUserConfirmedProblem(false)
    }

    // Reset confirmation state after it's been processed
    useEffect(() => {
    if (userConfirmedProblem) {
        const timer = setTimeout(resetConfirmation, 500)
        return () => clearTimeout(timer)
    }
    }, [userConfirmedProblem])

    return {
        selectedProblemType,
        userConfirmedProblem,
        handleProblemSelect,
        handleConfirmProblem,
        resetConfirmation
    }
}