// useClientState.ts
import { useState, useEffect } from "react"

export function useClientState() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return { isLoading, setIsLoading, isClient }
}