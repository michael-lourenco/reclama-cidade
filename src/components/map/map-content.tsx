"use client"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import type { LeafletMouseEvent } from "leaflet"
import { PROBLEM_TYPES } from "@/constants/map-constants"
import { dbFirestore, getMarkers, addMarker } from "@/services/firebase/FirebaseService"
import type { Marker } from "@/application/entities/Marker"
import { useMarkers } from "@/hooks/use-markers"

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
  const { markers, setMarkers, loadMarkersFromFirebase, saveMarkerToFirebase } = useMarkers()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const iconsRef = useRef<Record<string, any>>({})
  const mapInitializedRef = useRef<boolean>(false) // Nova ref para controlar a inicialização
  const defaultLocation: [number, number] = [-23.5902, -48.0338]
  const defaultZoom = 15

  // Memoize functions that don't need to be recreated on every render
  const getProblemLabel = useCallback((type: string): string => {
    switch (type) {
      case PROBLEM_TYPES.BURACO:
        return "Buraco"
      case PROBLEM_TYPES.ALAGAMENTO:
        return "Alagamento"
      case PROBLEM_TYPES.ILUMINACAO:
        return "Iluminação"
      default:
        return "Desconhecido"
    }
  }, [])

  // Handle confirmed problem selection and marker update
  useEffect(() => {
    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !currentMarkerRef.current ||
      !leafletRef.current
    ) {
      return
    }

    // Get current position
    const markerPosition = currentMarkerRef.current.getLatLng()

    // Remove current marker
    mapInstanceRef.current.removeLayer(currentMarkerRef.current)

    // Add new marker with custom icon
    const L = leafletRef.current
    const newMarker = L.marker([markerPosition.lat, markerPosition.lng], {
      icon: iconsRef.current[selectedProblemType],
    }).addTo(mapInstanceRef.current)

    newMarker.bindPopup(`Problema: ${getProblemLabel(selectedProblemType)}`).openPopup()

    // Salvar o marcador no Firebase
    const saveMarkerToFirebase = async () => {
      try {
        // Obter informações do usuário atual do localStorage
        const userDataString = localStorage.getItem("user")
        const userData = userDataString ? JSON.parse(userDataString) : null
        const userEmail = userData?.email || "Usuário anônimo"
        
        // Criar objeto de marcador para salvar
        const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const newMarkerData: Marker = {
          id: markerId,
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          type: selectedProblemType,
          userEmail,
          createdAt: new Date()
        }
        
        // Adicionar ao Firebase usando o FirebaseService
        await addMarker(dbFirestore, newMarkerData)
        console.log("Marcador salvo com sucesso:", newMarkerData)
        
        // Atualizar o estado local de marcadores
        setMarkers(prev => [...prev, newMarkerData])
      } catch (error) {
        console.error("Erro ao salvar marcador no Firebase:", error)
      }
    }
    
    // Executar a função de salvamento
    saveMarkerToFirebase()

    // Update current marker reference
    currentMarkerRef.current = newMarker

    // Reset confirmation flag
    resetConfirmation()
  }, [userConfirmedProblem, selectedProblemType, getProblemLabel, resetConfirmation])

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

  // Add CSS for marker icons
  const addMarkerStyles = useCallback(() => {
    if (document.querySelector('style[data-id="marker-styles"]')) return

    const style = document.createElement("style")
    style.dataset.id = "marker-styles"
    style.textContent = `
      .buraco-icon {
        filter: hue-rotate(320deg); /* Vermelho */
      }
      .alagamento-icon {
        filter: hue-rotate(60deg); /* Amarelo */
      }
      .iluminacao-icon {
        filter: hue-rotate(240deg); /* Azul */
      }
      .user-location-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `
    document.head.appendChild(style)
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

        // Load Leaflet library only once
        if (!leafletRef.current) {
          const L = await import("leaflet")
          leafletRef.current = L
        }

        const L = leafletRef.current
        console.log("Inicializando mapa Leaflet")

        // Verificação adicional antes da criação do mapa
        if (mapInstanceRef.current) {
          console.log("Mapa já existe, pulando inicialização")
          setIsLoading(false)
          return
        }

        // Create custom icons once
        if (Object.keys(iconsRef.current).length === 0) {
          const defaultIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })

          const buracoIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "buraco-icon",
          })

          const alagamentoIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "alagamento-icon",
          })

          const iluminacaoIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "iluminacao-icon",
          })

          iconsRef.current = {
            [PROBLEM_TYPES.BURACO]: buracoIcon,
            [PROBLEM_TYPES.ALAGAMENTO]: alagamentoIcon,
            [PROBLEM_TYPES.ILUMINACAO]: iluminacaoIcon,
            default: defaultIcon,
          }
        }

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
            const icon = iconsRef.current[marker.type] || iconsRef.current.default
            const mapMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(mapInstance)
            
            // Converter a data para um objeto Date se ela não for
            let markerDate: Date
            if (marker.createdAt instanceof Date) {
              markerDate = marker.createdAt
            } else if (marker.createdAt && typeof marker.createdAt === 'object' && 'seconds' in marker.createdAt) {
              // Lidar com Timestamp do Firestore
              markerDate = new Date((marker.createdAt as any).seconds * 1000)
            } else {
              markerDate = new Date(marker.createdAt as any)
            }

            // Add popup with information
            mapMarker.bindPopup(`
              <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
              Reportado em: ${markerDate.toLocaleDateString()} ${markerDate.toLocaleTimeString()}<br>
              Por: ${marker.userEmail || 'Usuário anônimo'}
            `)
          })

          // Center map on most recent marker
          // Ordenar marcadores por data descendente (mais recente primeiro)
          const sortedMarkers = [...firebaseMarkers].sort((a, b) => {
            let dateA: Date
            let dateB: Date
            
            if (a.createdAt instanceof Date) {
              dateA = a.createdAt
            } else if (a.createdAt && typeof a.createdAt === 'object' && 'seconds' in a.createdAt) {
              dateA = new Date((a.createdAt as any).seconds * 1000)
            } else {
              dateA = new Date(a.createdAt as any)
            }
            
            if (b.createdAt instanceof Date) {
              dateB = b.createdAt
            } else if (b.createdAt && typeof b.createdAt === 'object' && 'seconds' in b.createdAt) {
              dateB = new Date((b.createdAt as any).seconds * 1000)
            } else {
              dateB = new Date(b.createdAt as any)
            }
            
            return dateB.getTime() - dateA.getTime()
          })
          
          if (sortedMarkers.length > 0) {
            const mostRecent = sortedMarkers[0]
            mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom)
          }
        } else {
          // Add default marker if no saved markers
          const tempMarker = L.marker(defaultLocation, { icon: iconsRef.current.default })
            .addTo(mapInstance)
            .bindPopup("Clique para reportar um problema")
            .openPopup()

          currentMarkerRef.current = tempMarker
        }

        // Allow clicking on map to add/move marker
        mapInstance.on("click", (e: LeafletMouseEvent) => {
          const { lat, lng } = e.latlng

          if (currentMarkerRef.current) {
            mapInstance.removeLayer(currentMarkerRef.current)
          }

          // Create new temporary marker
          const newMarker = L.marker([lat, lng], { icon: iconsRef.current.default })
            .addTo(mapInstance)
            .bindPopup("Clique em 'Reportar problema' para identificar o tipo")
            .openPopup()

          currentMarkerRef.current = newMarker
        })

        // Get user location and continuously track it
        if ("geolocation" in navigator) {
          // First get initial position
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords

              // Update map view
              mapInstance.setView([latitude, longitude], defaultZoom)

              // Create or move user location marker
              if (currentMarkerRef.current) {
                currentMarkerRef.current.setLatLng([latitude, longitude])
                currentMarkerRef.current.bindPopup("Sua localização").openPopup()
              } else {
                // Create a special marker for user location
                const userIcon = new L.Icon({
                  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                  className: "user-location-icon",
                })

                currentMarkerRef.current = L.marker([latitude, longitude], {
                  icon: userIcon,
                  zIndexOffset: 1000, // Make sure user marker is on top
                })
                  .addTo(mapInstance)
                  .bindPopup("Sua localização")
              }
            },
            (error) => {
              console.error("Erro ao obter localização do usuário:", error)
            },
          )

          // Then set up continuous tracking
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords

              // Update map view to follow user
              mapInstance.setView([latitude, longitude], mapInstance.getZoom())

              // Update user marker position
              if (currentMarkerRef.current) {
                currentMarkerRef.current.setLatLng([latitude, longitude])
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
      if (mapInstanceRef.current && e.detail) {
        mapInstanceRef.current.setView([e.detail.lat, e.detail.lng], defaultZoom)
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
  }, [loadMarkersFromFirebase, getProblemLabel, addLeafletCSS, addMarkerStyles])

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