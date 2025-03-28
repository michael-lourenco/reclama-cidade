"use client"
import { PROBLEM_TYPES } from "@/constants/map-constants"
import { useCallback, useRef } from "react"

export const useMarkerIcons = () => {
  const iconsRef = useRef<Record<string, any>>({})
  const leafletRef = useRef<any>(null)

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

  // Initialize icons
  const initializeIcons = useCallback((L: any) => {
    if (Object.keys(iconsRef.current).length > 0) {
      return iconsRef.current
    }

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

    const userLocationIcon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: "user-location-icon",
    })

    iconsRef.current = {
      [PROBLEM_TYPES.BURACO]: buracoIcon,
      [PROBLEM_TYPES.ALAGAMENTO]: alagamentoIcon,
      [PROBLEM_TYPES.ILUMINACAO]: iluminacaoIcon,
      default: defaultIcon,
      userLocation: userLocationIcon,
    }

    return iconsRef.current
  }, [])

  const setLeafletRef = (L: any) => {
    leafletRef.current = L
  }

  const getIcons = () => {
    if (leafletRef.current && Object.keys(iconsRef.current).length === 0) {
      return initializeIcons(leafletRef.current)
    }
    return iconsRef.current
  }

  return {
    addMarkerStyles,
    initializeIcons,
    getIcons,
    setLeafletRef,
  }
}

