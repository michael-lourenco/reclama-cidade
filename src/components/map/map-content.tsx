"use client"
import type { Marker } from "@/application/entities/Marker"
import { useMarkerIcons } from "@/hooks/use-marker-icons"
import { useMarkerInteractions } from "@/hooks/use-marker-interactions"
import { useMarkerPopup } from "@/hooks/use-marker-popup"
import { useMarkers } from "@/hooks/use-markers"
import { addMarker, dbFirestore } from "@/services/firebase/FirebaseService"
import type React from "react"
import { useCallback, useEffect, useRef } from "react"

// Componente interno que será carregado apenas no cliente
const MapContent = ({
  setIsLoading,
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: string | null
  userConfirmedProblem: boolean
  resetConfirmation: () => void
}) => {
  const { markers, setMarkers, loadMarkersFromFirebase } = useMarkers()
  const { addMarkerStyles, initializeIcons, getIcons, setLeafletRef } = useMarkerIcons()
  const { addLikeStyles, createExistingMarkerPopup, createNewMarkerPopup, convertToDate } = useMarkerPopup()

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const userLocationMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const mapInitializedRef = useRef<boolean>(false)
  const defaultLocation: [number, number] = [-23.5902, -48.0338]
  const defaultZoom = 15

  const { handleLikeMarker, getCurrentUserEmail } = useMarkerInteractions(markers, setMarkers, userLocationMarkerRef)

  // Add Leaflet CSS
  const addLeafletCSS = useCallback(() => {
    if (document.querySelector('link[href*="leaflet.css"]')) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)
  }, [])

  // Initialize map only once
  useEffect(() => {
    // Verificação principal para evitar múltiplas inicializações
    if (!mapRef.current || mapInitializedRef.current) {
      return
    }

    // Marcar que a inicialização começou
    mapInitializedRef.current = true

    async function initMap() {
      try {
        // Add required styles
        addLeafletCSS()
        addMarkerStyles()
        addLikeStyles()

        // Load Leaflet library only once
        if (!leafletRef.current) {
          const L = await import("leaflet")
          leafletRef.current = L
          setLeafletRef(L)
        }

        const L = leafletRef.current
        console.log("Inicializando mapa Leaflet")

        // Verificação adicional antes da criação do mapa
        if (mapInstanceRef.current) {
          console.log("Mapa já existe, pulando inicialização")
          setIsLoading(false)
          return
        }

        // Initialize icons
        initializeIcons(L)
        const icons = getIcons()

        // Initialize map
        const mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView(defaultLocation, defaultZoom)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstance)

        // Store map instance
        mapInstanceRef.current = mapInstance

        // Load markers from Firebase
        const firebaseMarkers = await loadMarkersFromFirebase()

        if (firebaseMarkers && firebaseMarkers.length > 0) {
          // Add all saved markers to the map
          firebaseMarkers.forEach((marker) => {
            const icon = icons[marker.type] || icons.default
            const mapMarker = L.marker([marker.lat, marker.lng], {
              icon,
            }).addTo(mapInstance)

            // Criar popup personalizado com botão de like
            const popupContent = createExistingMarkerPopup(marker, handleLikeMarker)
            mapMarker.bindPopup(popupContent)
          })

          // Center map on most recent marker
          // Ordenar marcadores por data descendente (mais recente primeiro)
          const sortedMarkers = [...firebaseMarkers].sort((a, b) => {
            const dateA = convertToDate(a.createdAt)
            const dateB = convertToDate(b.createdAt)
            return dateB.getTime() - dateA.getTime()
          })

          if (sortedMarkers.length > 0) {
            const mostRecent = sortedMarkers[0]
            mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom)
          }
        }

        // Get user location and continuously track it
        if ("geolocation" in navigator) {
          // First get initial position
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords

              // Update map view
              mapInstance.setView([latitude, longitude], defaultZoom)

              // Create user location marker
              const userIcon = icons.userLocation

              userLocationMarkerRef.current = L.marker([latitude, longitude], {
                icon: userIcon,
                zIndexOffset: 1000, // Make sure user marker is on top
              })
                .addTo(mapInstance)
                .bindPopup("Sua localização")
                .openPopup()
            },
            (error) => {
              console.error("Erro ao obter localização do usuário:", error)

              // Cria o marcador na posição padrão se não conseguir obter a localização
              const userIcon = icons.userLocation
              userLocationMarkerRef.current = L.marker(defaultLocation, {
                icon: userIcon,
                zIndexOffset: 1000,
              })
                .addTo(mapInstance)
                .bindPopup("Sua localização (aproximada)")
                .openPopup()
            },
          )

          // Then set up continuous tracking
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords

              // Update map view to follow user
              mapInstance.setView([latitude, longitude], mapInstance.getZoom())

              // Update user marker position
              if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setLatLng([latitude, longitude])
              }
            },
            (error) => {
              console.error("Erro ao rastrear localização do usuário:", error)
            },
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000,
            },
          )

          // Clean up the watch when component unmounts
          return () => {
            navigator.geolocation.clearWatch(watchId)
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove()
              mapInstanceRef.current = null
              mapInitializedRef.current = false
            }
          }
        }

        // Force size recalculation
        setTimeout(() => {
          mapInstance.invalidateSize()
        }, 100)

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error)
        setIsLoading(false)
        // Resetar flag se houver erro para permitir tentar novamente
        mapInitializedRef.current = false
      }
    }

    initMap()

    // Add event listener for centering on user
    const handleCenterOnUser = (e: CustomEvent) => {
      if (mapInstanceRef.current && userLocationMarkerRef.current) {
        const latlng = userLocationMarkerRef.current.getLatLng()
        mapInstanceRef.current.setView([latlng.lat, latlng.lng], defaultZoom)
      }
    }

    document.addEventListener("centerOnUser", handleCenterOnUser as EventListener)

    return () => {
      document.removeEventListener("centerOnUser", handleCenterOnUser as EventListener)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        mapInitializedRef.current = false
      }
    }
  }, [
    loadMarkersFromFirebase,
    addLeafletCSS,
    addMarkerStyles,
    addLikeStyles,
    initializeIcons,
    getIcons,
    setLeafletRef,
    handleLikeMarker,
    createExistingMarkerPopup,
    convertToDate,
  ])

  // Handle confirmed problem selection and marker update
  useEffect(() => {
    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !userLocationMarkerRef.current ||
      !leafletRef.current
    ) {
      return
    }

    // Get current position of user marker
    const markerPosition = userLocationMarkerRef.current.getLatLng()

    // Salvar o marcador no Firebase
    const saveMarkerToFirebase = async () => {
      try {
        // Obter informações do usuário atual
        const userEmail = getCurrentUserEmail() || "Usuário anônimo"

        // Criar objeto de marcador para salvar
        const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const newMarkerData: Marker = {
          id: markerId,
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          type: selectedProblemType,
          userEmail,
          createdAt: new Date(),
          likedBy: [], // Inicializa como um array vazio
        }

        // Adicionar ao Firebase usando o FirebaseService
        await addMarker(dbFirestore, newMarkerData)
        console.log("Marcador salvo com sucesso:", newMarkerData)

        // Atualizar o estado local de marcadores
        setMarkers((prev) => [...prev, newMarkerData])

        // Adicionar marker no mapa com o ícone correto (mas manter o user location marker)
        const L = leafletRef.current
        const icons = getIcons()
        const newMarker = L.marker([markerPosition.lat, markerPosition.lng], {
          icon: icons[selectedProblemType],
        }).addTo(mapInstanceRef.current)

        // Criar popup personalizado com botão de like
        const popupContent = createNewMarkerPopup(selectedProblemType, userEmail)
        newMarker.bindPopup(popupContent).openPopup()
      } catch (error) {
        console.error("Erro ao salvar marcador no Firebase:", error)
      }
    }

    // Executar a função de salvamento
    saveMarkerToFirebase()

    // Reset confirmation flag
    resetConfirmation()
  }, [
    userConfirmedProblem,
    selectedProblemType,
    resetConfirmation,
    setMarkers,
    getCurrentUserEmail,
    getIcons,
    createNewMarkerPopup,
  ])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
}

export { MapContent }

