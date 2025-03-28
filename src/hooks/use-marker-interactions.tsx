"use client"
import type { Marker } from "@/application/entities/Marker"
import type React from "react"

import { dbFirestore, updateMarkerLikes } from "@/services/firebase/FirebaseService"
import { getDistance } from "@/utils/distance-utils"
import { useCallback } from "react"

export const useMarkerInteractions = (
  markers: Marker[],
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>,
  userLocationMarkerRef: React.MutableRefObject<any>,
) => {
  // Função para obter o email do usuário atual
  const getCurrentUserEmail = useCallback(() => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null
    return userData?.email || null
  }, [])

  // Handle marker like functionality
  const handleLikeMarker = useCallback(
    async (marker: Marker) => {
      try {
        const userEmail = getCurrentUserEmail()

        if (!userEmail) {
          alert("Por favor, faça login para curtir um marcador.")
          return
        }

        // Verificar distância do usuário ao marcador
        if (!userLocationMarkerRef.current) {
          alert("Localização do usuário não disponível.")
          return
        }

        const userLocation = userLocationMarkerRef.current.getLatLng()
        const markerLocation = { lat: marker.lat, lng: marker.lng }
        const distance = getDistance(userLocation, markerLocation)

        // Verificar se o usuário está dentro de 100 metros
        if (distance > 100) {
          alert("Você precisa estar a até 100 metros do marcador para curtir.")
          return
        }

        // Verificar se o usuário está tentando curtir seu próprio marcador
        if (marker.userEmail === userEmail) {
          alert("Você não pode curtir seu próprio marcador.")
          return
        }

        // Verificar se o usuário já curtiu o marcador
        if (marker.likedBy?.includes(userEmail)) {
          alert("Você já curtiu este marcador.")
          return
        }

        // Atualizar likes no Firebase
        await updateMarkerLikes(dbFirestore, marker.id, userEmail)

        // Atualizar estado local dos marcadores
        const updatedMarkers = markers.map((m) =>
          m.id === marker.id ? { ...m, likedBy: m.likedBy ? [...m.likedBy, userEmail] : [userEmail] } : m,
        )
        setMarkers(updatedMarkers)
      } catch (error) {
        console.error("Erro ao curtir marcador:", error)
        alert("Não foi possível curtir o marcador. Tente novamente.")
      }
    },
    [getCurrentUserEmail, markers, setMarkers, userLocationMarkerRef],
  )

  return {
    handleLikeMarker,
    getCurrentUserEmail,
  }
}

