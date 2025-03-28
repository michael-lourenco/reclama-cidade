"use client"

import { useRef, useCallback } from "react"
import { PROBLEM_TYPES } from "@/constants/map-constants"
import { LEAFLET_ICON_URLS } from "@/constants/map-constants"
import type { MapIcon } from "@/types/map-types"

// Define a more specific type for Leaflet
interface LeafletStatic {
  Icon: new (options: MapIcon) => LeafletIcon
}

// Define the LeafletIcon interface
interface LeafletIcon {
  options: MapIcon
  createIcon: () => HTMLElement
  createShadow: () => HTMLElement
}

export const useMapIcons = (L: LeafletStatic) => {
  const iconsRef = useRef<Record<string, LeafletIcon>>({})

  const createIcons = useCallback(() => {
    if (!L || Object.keys(iconsRef.current).length > 0) return iconsRef.current

    const baseIconConfig: MapIcon = {
      iconUrl: LEAFLET_ICON_URLS.ICON,
      iconRetinaUrl: LEAFLET_ICON_URLS.ICON_RETINA,
      shadowUrl: LEAFLET_ICON_URLS.SHADOW,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }

    const defaultIcon = new L.Icon(baseIconConfig)

    const buracoIcon = new L.Icon({
      ...baseIconConfig,
      className: "buraco-icon",
    })

    const alagamentoIcon = new L.Icon({
      ...baseIconConfig,
      className: "alagamento-icon",
    })

    const iluminacaoIcon = new L.Icon({
      ...baseIconConfig,
      className: "iluminacao-icon",
    })

    const blitzIcon = new L.Icon({
      ...baseIconConfig,
      className: "blitz-icon",
    })
    const pistaIcon = new L.Icon({
      ...baseIconConfig,
      className: "pista-icon",
    })
    const bueiroAbertoIcon = new L.Icon({
      ...baseIconConfig,
      className: "bueiro-aberto-icon",
    })
    const bueiroVazamentoIcon = new L.Icon({
      ...baseIconConfig,
      className: "bueiro-vazamento-icon",
    })
    const semafaroIcon = new L.Icon({
      ...baseIconConfig,
      className: "semafaro-icon",
    })


    const userLocationIcon = new L.Icon({
      ...baseIconConfig,
      className: "user-location-icon",
    })

    iconsRef.current = {
      [PROBLEM_TYPES.BURACO]: buracoIcon,
      [PROBLEM_TYPES.ALAGAMENTO]: alagamentoIcon,
      [PROBLEM_TYPES.ILUMINACAO]: iluminacaoIcon,
      [PROBLEM_TYPES.BLITZ]: blitzIcon,
      [PROBLEM_TYPES.PISTA]: pistaIcon,
      [PROBLEM_TYPES.BUEIRO_ABERTO]: bueiroAbertoIcon,
      [PROBLEM_TYPES.BUEIRO_VAZAMENTO]: bueiroVazamentoIcon,
      [PROBLEM_TYPES.SEMAFARO]: semafaroIcon,
      default: defaultIcon,
      userLocation: userLocationIcon,
    }

    return iconsRef.current
  }, [L])

  return { iconsRef, createIcons }
}

