import type { Marker } from "@/components/marker/types/marker"
import { updateMarkerLikes, updateMarkerResolved } from "@/services/supabase/SupabaseService"
import { getDistance } from "@/utils/distance"
import { toast } from "sonner"

export const getCurrentUserEmail = () => {
  const userDataString = localStorage.getItem("user")
  const userData = userDataString ? JSON.parse(userDataString) : null
  return userData?.email || null
}

export const shouldShowResolvedButton = (marker: Marker): boolean => {
  return Boolean(marker.likedBy && marker.likedBy.length >= 1)
}

export const handleLikeMarker = async (
  marker: Marker,
  userLocationMarker: any,
  markers: Marker[],
  setMarkers: (markers: Marker[]) => void,
) => {
  try {
    const userEmail = getCurrentUserEmail()


    if (!userEmail) {
      toast.error("Por favor, faça login para curtir um marcador.")
      return
    }

    if (!userLocationMarker) {
      toast.error("Localização do usuário não disponível.")
      return
    }

    const userLocation = userLocationMarker.getLatLng()
    const markerLocation = { lat: marker.lat, lng: marker.lng }
    const distance = getDistance(userLocation, markerLocation)

    if (distance > 100) {
      toast("Você precisa estar a até 100 metros do marcador para curtir.", { icon: "📍" })
      return
    }

    if (marker.userEmail === userEmail) {
      toast("Você não pode curtir seu próprio marcador.", { icon: "🚫" })
      return
    }

    if (marker.likedBy?.includes(userEmail)) {
      toast("Você já curtiu este marcador.", { icon: "👍" })
      return
    }

    await updateMarkerLikes(marker.id, userEmail)

    await updateMarkerResolved(marker.id, userEmail)

    const updatedMarkers = markers.map((m) =>
      m.id === marker.id ? { ...m, likedBy: m.likedBy ? [...m.likedBy, userEmail] : [userEmail] } : m,
    )
    setMarkers(updatedMarkers)

    return true
  } catch (error) {
    console.error("Erro ao curtir marcador:", error)
    toast.error("Não foi possível curtir o marcador. Tente novamente.")
    return false
  }
}


export const handleResolvedMarker = async (
  marker: Marker,
  userLocationMarker: any,
  markers: Marker[],
  setMarkers: (markers: Marker[]) => void,
) => {
  try {
    const userEmail = getCurrentUserEmail()


    if (!userEmail) {
      toast.error("Por favor, faça login para confirmar resolução.")
      return
    }

    if (!userLocationMarker) {
      toast.error("Localização do usuário não disponível.")
      return
    }

    const userLocation = userLocationMarker.getLatLng()
    const markerLocation = { lat: marker.lat, lng: marker.lng }
    const distance = getDistance(userLocation, markerLocation)

    if (distance > 100) {
      toast("Você precisa estar a até 100 metros do marcador para confirmar.", { icon: "📍" })
      return
    }

    if (marker.resolvedBy?.includes(userEmail)) {
      toast("Você já confirmou que este problema foi solucionado.", { icon: "✅" })
      return
    }

    await updateMarkerResolved(marker.id, userEmail)

    const updatedMarkers = markers.map((m) =>
      m.id === marker.id ? { ...m, resolvedBy: m.resolvedBy ? [...m.resolvedBy, userEmail] : [userEmail] } : m,
    )
    setMarkers(updatedMarkers)

    return true
  } catch (error) {
    console.error("Erro ao curtir marcador:", error)
    toast.error("Não foi possível confirmar resolução. Tente novamente.")
    return false
  }
}

export const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }

  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }

  return new Date(timestamp)
}