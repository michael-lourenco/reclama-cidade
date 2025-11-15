
"use client"

import type { Marker } from "@/components/marker/types/marker"
import { addMarker, getMarkers } from "@/services/supabase/SupabaseService"
import { useCallback, useMemo, useState } from "react"

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([])

  const loadMarkersFromFirebase = useCallback(async () => {
    try {
      const fetchedMarkers = await getMarkers()
      const validMarkers = fetchedMarkers.filter(
        (marker: Partial<Marker>) => marker && marker.lat !== undefined && marker.lng !== undefined && marker.type !== undefined,
      ) as Marker[]

      setMarkers(validMarkers)
      return validMarkers
    } catch (error) {
      console.error("Erro ao carregar marcadores do Supabase:", error)
      return [] as Marker[]
    }
  }, [])

  const saveMarkerToFirebase = useCallback(async (lat: number, lng: number, type: string) => {
    try {
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null
      const userEmail = userData?.email || "Usuário anônimo"
      const currentStatus = "reportado"

      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const newMarkerData: Marker = {
        id: markerId,
        lat,
        lng,
        type,
        userEmail,
        createdAt: new Date(),
        currentStatus,
      }

      await addMarker(newMarkerData)
      console.log("Marcador salvo com sucesso:", newMarkerData)

      setMarkers((prev) => [...prev, newMarkerData])

      return newMarkerData
    } catch (error) {
      console.error("Erro ao salvar marcador no Supabase:", error)
      throw error
    }
  }, [])

  const markerTypes = useMemo(() => {
    const types = new Set<string>()
    markers.forEach(marker => {
      if (marker.type) {
        types.add(marker.type)
      }
    })
    return Array.from(types)
  }, [markers])

  const getFilteredMarkers = useCallback((selectedTypes: string[]) => {
    if (!selectedTypes.length) {
      return markers
    }
    return markers.filter(marker => selectedTypes.includes(marker.type))
  }, [markers])

  return {
    markers,
    setMarkers,
    loadMarkersFromFirebase,
    saveMarkerToFirebase,
    markerTypes,
    getFilteredMarkers
  }
}
