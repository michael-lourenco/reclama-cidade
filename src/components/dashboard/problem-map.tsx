
"use client"

import type { Marker as MarkerType } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/supabase/SupabaseService"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Loader } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ProblemMapProps {
  markers: MarkerType[]
}

const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }
  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

export function ProblemMap({ markers }: ProblemMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<L.Map | null>(null)
  const [leafletMarkers, setLeafletMarkers] = useState<L.Marker[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/map-icons-fixed/padrao.svg",
        iconUrl: "/map-icons-fixed/padrao.svg",
        shadowUrl: "/map-icons-fixed/sombra.svg",
      })
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || map) return

    const leafletMap = L.map(mapRef.current).setView([-23.5505, -46.6333], 12)

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(leafletMap)

    setMap(leafletMap)
    setMapLoaded(true)

    return () => {
      leafletMap.remove()
    }
  }, [map])

  useEffect(() => {
    if (!map || !mapLoaded) return

    leafletMarkers.forEach((marker) => marker.remove())

    const newMarkers = markers.map((marker) => {
      let iconColor = "red"

      switch (marker.currentStatus) {
        case ProblemStatus.RESOLVED:
          iconColor = "green"
          break
        case ProblemStatus.IN_PROGRESS:
          iconColor = "orange"
          break
        case ProblemStatus.UNDER_ANALYSIS:
        case ProblemStatus.VERIFIED:
          iconColor = "blue"
          break
        default:
          iconColor = "red"
      }

      const markerIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: markerIcon,
      }).addTo(map)

      leafletMarker.bindPopup(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${marker.type}</h3>
          <p style="margin: 0 0 4px 0;"><strong>Status:</strong> ${marker.currentStatus || ProblemStatus.REPORTED}</p>
          <p style="margin: 0 0 4px 0;"><strong>Reportado por:</strong> ${marker.userEmail}</p>
          <p style="margin: 0 0 4px 0;"><strong>Data:</strong> ${convertToDate(marker.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
      `)

      return leafletMarker
    })

    setLeafletMarkers(newMarkers)

    if (newMarkers.length > 0 && markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((marker) => [marker.lat, marker.lng]),
      )
      map.fitBounds(bounds)
    }
  }, [map, mapLoaded, markers, setLeafletMarkers])

  return (
    <div className="relative h-full w-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      )}
      <div
        ref={mapRef}
        className="h-full w-full"
      />
    </div>
  )
}
