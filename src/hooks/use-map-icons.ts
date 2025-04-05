import { useRef, useCallback } from "react";
import { PROBLEM_TYPES, LEAFLET_ICON_URLS } from "@/constants/map-constants";
import type { MapIcon, LeafletStatic, LeafletIcon, ProblemType } from "@/types/map";

export const useMapIcons = (L: LeafletStatic) => {
  const iconsRef = useRef<Record<string, LeafletIcon>>({});

  const createIcons = useCallback(() => {
    if (!L || Object.keys(iconsRef.current).length > 0) return iconsRef.current;

    // Configuração base para todos os ícones
    const baseIconConfig: MapIcon = {
      iconUrl: LEAFLET_ICON_URLS.ICON,
      iconRetinaUrl: LEAFLET_ICON_URLS.ICON_RETINA,
      shadowUrl: LEAFLET_ICON_URLS.SHADOW,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    };

    // Cria o ícone padrão
    const defaultIcon = new L.Icon(baseIconConfig);
    
    // Cria o ícone de localização do usuário
    const userLocationIcon = new L.Icon({
      ...baseIconConfig,
      className: "user-location-icon",
    });
    
    // Inicializa o objeto de ícones com valores padrão
    const icons: Record<string, LeafletIcon> = {
      default: defaultIcon,
      userLocation: userLocationIcon,
    };
    
    // Cria dinamicamente os ícones para cada tipo de problema
    Object.values(PROBLEM_TYPES).forEach((type: ProblemType) => {
      icons[type] = new L.Icon({
        ...baseIconConfig,
        className: `${type}-icon`,
      });
    });
    
    iconsRef.current = icons;
    return iconsRef.current;
  }, [L]);

  return { iconsRef, createIcons };
};