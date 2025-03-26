"use client"
import { useRef, useEffect, useCallback } from "react"
import { DEFAULT_LOCATION, DEFAULT_ZOOM } from "@/constants/map-constants"
import { useMapStyles } from "@/hooks/use-map-styles"
import { useMapIcons } from "@/hooks/use-map-icons"
import type { LeafletMouseEvent } from "leaflet"
import type { MapRefs, MapIcon } from "@/types/map-types"

export const useMap = (onMapClick: (e: LeafletMouseEvent) => void) => {

  // Create all necessary refs
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const mapInitializedRef = useRef<boolean>(false)
  // Create a separate ref for icons that matches the expected type
  const typedIconsRef = useRef<Record<string, MapIcon> | null>(null)

  // Get style hooks
  const { addLeafletCSS, addMarkerStyles } = useMapStyles()

  // Initialize icons (must be called outside initializeMap to satisfy hook rules)
  const { createIcons, iconsRef } = useMapIcons(leafletRef.current)

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

      // Create icons
      createIcons()

      // Map the Leaflet icons to our MapIcon interface
      if (iconsRef.current) {
        const mappedIcons: Record<string, MapIcon> = {}

        Object.entries(iconsRef.current).forEach(([key, leafletIcon]) => {
          // Extract the properties we need from the Leaflet icon
          // You may need to adjust this based on the actual structure of LeafletIcon
          mappedIcons[key] = {
            iconUrl: leafletIcon.options.iconUrl,
            iconRetinaUrl: leafletIcon.options.iconRetinaUrl || leafletIcon.options.iconUrl,
            shadowUrl: leafletIcon.options.shadowUrl || "",
            iconSize: leafletIcon.options.iconSize || [25, 41],
            iconAnchor: leafletIcon.options.iconAnchor || [12, 41],
            popupAnchor: leafletIcon.options.popupAnchor || [1, -34],
            shadowSize: leafletIcon.options.shadowSize || [41, 41],
            className: leafletIcon.options.className,
          }
        })

        typedIconsRef.current = mappedIcons
      }

      mapInitializedRef.current = true
      return { success: true, L, mapInstance, iconsRef }
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error)
      mapInitializedRef.current = false
      return { success: false, error }
    }
  }, [addLeafletCSS, addMarkerStyles, onMapClick, createIcons])

  // Clean up map
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      mapInitializedRef.current = false
      typedIconsRef.current = null
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

  // We don't need this line as we're handling icons in initializeMap
  // const { iconsRef } = useMapIcons(leafletRef.current)

  // Create refs object for easier passing
  const mapRefs: MapRefs = {
    mapRef,
    mapInstanceRef,
    currentMarkerRef,
    leafletRef,
    iconsRef: typedIconsRef,
    mapInitializedRef,
  }

  return {
    mapRefs,
    initializeMap,
    cleanupMap,
  }
}
