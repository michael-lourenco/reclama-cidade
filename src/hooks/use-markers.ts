"use client"

import { useState, useCallback } from "react"
import { dbFirestore, getMarkers, addMarker } from "@/services/firebase/FirebaseService"
import type { Marker } from "@/types/map-types"

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([])

  // Load markers from Firebase
  const loadMarkersFromFirebase = useCallback(async () => {
    try {
      const fetchedMarkers = await getMarkers(dbFirestore)
      // Ensure all markers have the necessary properties
      const validMarkers = fetchedMarkers.filter(
        (marker: any) => marker && marker.lat !== undefined && marker.lng !== undefined && marker.type !== undefined,
      ) as Marker[]

      setMarkers(validMarkers)
      return validMarkers
    } catch (error) {
      console.error("Erro ao carregar marcadores do Firebase:", error)
      return [] as Marker[]
    }
  }, [])

  // Save a new marker to Firebase
  const saveMarkerToFirebase = useCallback(async (lat: number, lng: number, type: string) => {
    try {
      // Get current user info from localStorage
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null
      const userEmail = userData?.email || "Usuário anônimo"

      // Create marker object to save
      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const newMarkerData: Marker = {
        id: markerId,
        lat,
        lng,
        type,
        userEmail,
        createdAt: new Date(),
      }

      // Add to Firebase using FirebaseService
      await addMarker(dbFirestore, newMarkerData)
      console.log("Marcador salvo com sucesso:", newMarkerData)

      // Update local markers state
      setMarkers((prev) => [...prev, newMarkerData])

      return newMarkerData
    } catch (error) {
      console.error("Erro ao salvar marcador no Firebase:", error)
      throw error
    }
  }, [])

  return { markers, setMarkers, loadMarkersFromFirebase, saveMarkerToFirebase }
}

