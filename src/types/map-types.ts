import type React from "react"

export interface Marker {
  id: string
  lat: number
  lng: number
  type: string
  userEmail: string
  createdAt: Date | any // Supporting both Date and Firestore Timestamp
  likedBy?: string[] 
}

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

export interface MapRefs {
  mapRef: React.RefObject<HTMLDivElement>
  mapInstanceRef: React.MutableRefObject<any>
  currentMarkerRef: React.MutableRefObject<any>
  leafletRef: React.MutableRefObject<any>
  iconsRef: React.MutableRefObject<Record<string, any>>
  mapInitializedRef: React.MutableRefObject<boolean>
}

export interface MapContentProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: string | null
  userConfirmedProblem: boolean
  resetConfirmation: () => void
}

