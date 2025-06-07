"use client"
import { LocationControls } from "@/components/location-controls/location-controls"
import {
  initializeMap,
  setupLocationTracking,
} from "@/components/map/map-initializer"
import {
  addLeafletCSS,
  addLikeStyles,
  setupCenterOnUserEvent,
  setupResizeHandler,
} from "@/components/map/map-styles"
import { createAndSaveMarker } from "@/components/marker/marker-creator"
import { MarkerFilter } from "@/components/marker/marker-filter"
import {
  handleLikeMarker,
  handleResolvedMarker,
} from "@/components/marker/marker-interactions"
import { useMarkerStyles } from "@/components/marker/use-marker-styles"
import { useMarkers } from "@/components/marker/use-markers"
import { PROBLEM_CATEGORIES, TProblemType } from "@/constants/map-constants"
import type { Marker } from "@/components/marker/types/marker"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { SidebarTrigger } from "../ui/sidebar"

const MapContent = ({
  setIsLoading,
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu,
  selectedTypes,
  onFilterChange,
  onNeedLogin,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: TProblemType | undefined
  handleProblemSelect: (problemType: TProblemType) => void
  handleConfirmProblem: () => void
  userConfirmedProblem: boolean
  resetConfirmation: () => void
  toggleReportMenu: () => void
  selectedTypes: string[]
  onFilterChange: (selectedTypes: string[]) => void
  onNeedLogin: () => void
}) => {
  const {
    markers,
    setMarkers,
    loadMarkersFromFirebase,
    markerTypes,
    getFilteredMarkers,
  } = useMarkers()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const userLocationMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const iconsRef = useRef<Record<string, any>>({})
  const mapInitializedRef = useRef<boolean>(false)
  const defaultLocation: [number, number] = [-23.5902, -48.0338]
  const defaultZoom = 16
  const watchIdRef = useRef<number | null>(null)

  const markersLayerRef = useRef<any>(null)

  const initialCenteringDoneRef = useRef<boolean>(false)

  const [followMode, setFollowMode] = useState<boolean>(true)

  const addMarkerStyles = useMarkerStyles()

  const filteredMarkers = useMemo(() => {
    return getFilteredMarkers(selectedTypes)
  }, [getFilteredMarkers, selectedTypes, markers])

  const onLikeMarker = async (marker: Marker) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    await handleLikeMarker(
      marker,
      userLocationMarkerRef.current,
      markers,
      setMarkers,
    )
  }

  const onResolvedMarker = async (marker: Marker) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    await handleResolvedMarker(
      marker,
      userLocationMarkerRef.current,
      markers,
      setMarkers,
    )
  }

  const handleReportProblem = () => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    toggleReportMenu()
  }

  const centerOnUserLocation = () => {
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      const position = userLocationMarkerRef.current.getLatLng()
      mapInstanceRef.current.setView(
        [position.lat, position.lng],
        mapInstanceRef.current.getZoom(),
      )
    }
  }

  const updateMapMarkers = () => {
    if (
      !mapInstanceRef.current ||
      !leafletRef.current ||
      !iconsRef.current ||
      !filteredMarkers
    ) {
      return
    }

    if (markersLayerRef.current) {
      mapInstanceRef.current.removeLayer(markersLayerRef.current)
    }

    markersLayerRef.current = new leafletRef.current.LayerGroup()

    filteredMarkers.forEach((marker) => {
      const { lat, lng, type } = marker

      if (lat === undefined || lng === undefined || !type) {
        return
      }

      const icon = iconsRef.current[type] || iconsRef.current.default

      const leafletMarker = leafletRef.current.marker([lat, lng], { icon })

      leafletMarker.markerData = marker

      const popupContent = document.createElement("div")
      popupContent.className = "marker-popup"
      
      // Find the category or subcategory that matches the type
      let categoryLabel = type
      
      for (const category of PROBLEM_CATEGORIES) {
        if (category.type as unknown as TProblemType === type) {
          categoryLabel = category.label
          break
        }
        
        // Check subcategories
        const subcategory = category.subcategories?.find(
          sub => sub.type as unknown as TProblemType === type
        )
        
        if (subcategory) {
          categoryLabel = subcategory.label
          break
        }
      }
      
      popupContent.innerHTML = `
        <div class="marker-info">
          <p><strong>Tipo:</strong> ${categoryLabel}</p>
          <p><strong>Reportado por:</strong> ${marker.userEmail || "Anônimo"}</p>
          <p><strong>Status:</strong> ${marker.currentStatus || "Reportado"}</p>
          <div class="marker-actions">
            <button class="like-button">👍 ${marker.likedBy?.length || 0}</button>
            <button class="resolved-button">✅ ${marker.resolvedBy?.length || 0}</button>
          </div>
        </div>
      `

      const popup = leafletRef.current.popup().setContent(popupContent)
      leafletMarker.bindPopup(popup)

      leafletMarker.on("popupopen", () => {
        const likeButton = document.querySelector(".like-button")
        const resolvedButton = document.querySelector(".resolved-button")

        if (likeButton) {
          likeButton.addEventListener("click", () => onLikeMarker(marker))
        }

        if (resolvedButton) {
          resolvedButton.addEventListener("click", () =>
            onResolvedMarker(marker),
          )
        }
      })

      leafletMarker.addTo(markersLayerRef.current)
    })

    markersLayerRef.current.addTo(mapInstanceRef.current)
  }

  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && iconsRef.current) {
      updateMapMarkers()
    }
  }, [filteredMarkers])

  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) {
      return
    }

    mapInitializedRef.current = true

    async function initMap() {
      try {
        const userLocationPromise = new Promise<[number, number]>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve([position.coords.latitude, position.coords.longitude])
              },
              (error) => {
                console.warn("Erro ao obter localização do usuário:", error)
                reject(error)
              },
              { timeout: 3000, maximumAge: 0 },
            )
          },
        )

        let initialLocation = defaultLocation
        try {
          initialLocation = await Promise.race([
            userLocationPromise,
            new Promise<[number, number]>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 3000),
            ),
          ])
          initialCenteringDoneRef.current = true
        } catch (error) {
          console.warn(
            "Usando localização padrão para inicialização inicial:",
            error,
          )
        }

        const initOptions = {
          mapRef,
          mapInstanceRef,
          userLocationMarkerRef,
          leafletRef,
          iconsRef,
          defaultLocation: initialLocation,
          defaultZoom,
          loadMarkersFromFirebase,
          onLikeMarker,
          onResolvedMarker,
          setIsLoading,
          addLeafletCSS,
          addMarkerStyles,
          addLikeStyles,
          skipUserLocationSetView: initialCenteringDoneRef.current,
          skipMarkersAddition: true,
        }

        await initializeMap(initOptions)

        watchIdRef.current = setupLocationTracking(
          mapInstanceRef,
          userLocationMarkerRef,
          defaultZoom,
          followMode,
        )

        if (!initialCenteringDoneRef.current) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              if (mapInstanceRef.current && !initialCenteringDoneRef.current) {
                mapInstanceRef.current.setView(
                  [latitude, longitude],
                  defaultZoom,
                )
                initialCenteringDoneRef.current = true
              }
            },
            (error) => {
              console.error("Erro secundário ao obter localização:", error)
            },
            { timeout: 10000, maximumAge: 0 },
          )
        }

        updateMapMarkers()
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error)
        mapInitializedRef.current = false
      }
    }

    initMap()

    const cleanupCenterOnUserEvent = setupCenterOnUserEvent(
      mapInstanceRef,
      userLocationMarkerRef,
      defaultZoom,
    )

    return () => {
      cleanupCenterOnUserEvent()

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      if (markersLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markersLayerRef.current)
        markersLayerRef.current = null
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        mapInitializedRef.current = false
        initialCenteringDoneRef.current = false
      }
    }
  }, [
    loadMarkersFromFirebase,
    addMarkerStyles,
    followMode,
  ])

  useEffect(() => {
    console.log("Verificando condições para criar marcador:", {
      userConfirmedProblem,
      selectedProblemType,
      mapInitialized: !!mapInstanceRef.current,
      userLocationInitialized: !!userLocationMarkerRef.current,
      leafletInitialized: !!leafletRef.current
    })

    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !userLocationMarkerRef.current ||
      !leafletRef.current
    ) {
      return
    }

    console.log("Todas as condições atendidas, criando marcador para o tipo:", selectedProblemType)
    const markerPosition = userLocationMarkerRef.current.getLatLng()

    createAndSaveMarker({
      markerPosition,
      selectedProblemType,
      iconsRef,
      mapInstanceRef,
      leafletRef,
      setMarkers,
    })

    resetConfirmation()
  }, [userConfirmedProblem, selectedProblemType, resetConfirmation, setMarkers])

  useEffect(() => {
    return setupResizeHandler(mapInstanceRef)
  }, [])

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-full" />
      <LocationControls
        centerOnUserLocation={centerOnUserLocation}
        followMode={followMode}
        toggleReportMenu={handleReportProblem}
      />
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <MarkerFilter
          availableTypes={markerTypes}
          selectedTypes={selectedTypes}
          onFilterChange={onFilterChange}
        />
        <SidebarTrigger />
      </div>
    </div>
  )
}

export { MapContent }
