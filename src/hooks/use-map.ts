"use client"
import { useRef, useEffect, useCallback } from "react"
import { DEFAULT_LOCATION, DEFAULT_ZOOM } from "@/constants/map-constants"
import { useMapStyles } from "@/hooks/use-map-styles"
import { useMapIcons } from "@/hooks/use-map-icons"
import type { LeafletMouseEvent } from "leaflet"
import type { MapRefs } from "@/types/map-types"

export const useMap = (onMapClick: (e: LeafletMouseEvent) => void, setIsLoading: (loading: boolean) => void) => {
  // Create all necessary refs
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const mapInitializedRef = useRef<boolean>(false)

  // Get style hooks
  const { addLeafletCSS, addMarkerStyles } = useMapStyles()

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || mapInitializedRef.current || mapInstanceRef.current) {
      return { success: false }
    }

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

      // Create map instance
      const mapInstance = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(DEFAULT_LOCATION, DEFAULT_ZOOM)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapInstance)

      // Store map instance
      mapInstanceRef.current = mapInstance

      // Set up click handler
      mapInstance.on("click", onMapClick)

      // Force size recalculation
      setTimeout(() => {
        mapInstance.invalidateSize()
      }, 100)

      // Get icons
      const { createIcons, iconsRef } = useMapIcons(L)
      createIcons()

      mapInitializedRef.current = true
      return { success: true, L, mapInstance, iconsRef }
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error)
      mapInitializedRef.current = false
      return { success: false, error }
    }
  }, [addLeafletCSS, addMarkerStyles, onMapClick])

  // Clean up map
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      mapInitializedRef.current = false
    }
  }, [])

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

  const { iconsRef } = useMapIcons(leafletRef.current)

  // Create refs object for easier passing
  const mapRefs: MapRefs = {
    mapRef,
    mapInstanceRef,
    currentMarkerRef,
    leafletRef,
    iconsRef: iconsRef,
    mapInitializedRef,
  }

  return {
    mapRefs,
    initializeMap,
    cleanupMap,
  }
}

