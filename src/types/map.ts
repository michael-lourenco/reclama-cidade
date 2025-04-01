import type React from "react"
import { Marker } from "@/types/marker"

export interface MapIcon {
  iconUrl: string
  iconRetinaUrl: string
  shadowUrl: string
  iconSize: [number, number]
  iconAnchor: [number, number]
  popupAnchor: [number, number]
  shadowSize: [number, number]
  className?: string
}

// Define types for the map-related objects
export interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void;
  // Add other methods you use
}

export interface LeafletMarker {
  setLatLng: (latLng: [number, number]) => void;
  // Add other methods you use
}

export interface LeafletInstance {
  map: (element: HTMLElement) => LeafletMap;
  marker: (latLng: [number, number]) => LeafletMarker;
  // Add other properties you use
}

export interface MapRefs {
  mapRef: React.RefObject<HTMLDivElement | null>
  mapInstanceRef: React.RefObject<LeafletMap>
  currentMarkerRef: React.RefObject<LeafletMarker>
  leafletRef: React.RefObject<LeafletInstance>
  iconsRef: React.RefObject<Record<string, MapIcon> | null>
  mapInitializedRef: React.RefObject<boolean>
}

export interface MapContentProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: string | null
  userConfirmedProblem: boolean
  resetConfirmation: () => void
}