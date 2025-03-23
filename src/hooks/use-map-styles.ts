"use client"

import { useCallback } from "react"

export const useMapStyles = () => {
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

  return { addLeafletCSS, addMarkerStyles }
}

