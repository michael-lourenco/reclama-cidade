"use client";
import type { Marker } from "@/types/marker-types";
import { useMarkers } from "@/hooks/use-markers";
import type React from "react";
import { useRef } from "react";
import { useMarkerStyles } from "@/utils/marker-styles";
import { handleLikeMarker } from "@/utils/marker-interactions";
import { addLeafletCSS, addLikeStyles } from "@/utils/map-styles";
import { 
  useMapInitialization, 
  useCreateMarkerOnConfirmation, 
  useMapResizeHandler 
} from "@/utils/map-effects";

// Componente interno que será carregado apenas no cliente
const MapContent = ({
  setIsLoading,
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProblemType: string | null;
  userConfirmedProblem: boolean;
  resetConfirmation: () => void;
}) => {
  const { markers, setMarkers, loadMarkersFromFirebase } = useMarkers();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const iconsRef = useRef<Record<string, any>>({});
  const mapInitializedRef = useRef<boolean>(false);
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 15;

  // Add CSS for marker icons
  const addMarkerStyles = useMarkerStyles();

  const onLikeMarker = async (marker: any) => {
    await handleLikeMarker(marker, userLocationMarkerRef.current, markers, setMarkers);
  };

  // Utilização dos hooks extraídos
  useMapInitialization({
    mapRef,
    mapInitializedRef,
    mapInstanceRef,
    userLocationMarkerRef,
    leafletRef,
    iconsRef,
    defaultLocation,
    defaultZoom,
    loadMarkersFromFirebase,
    onLikeMarker,
    setIsLoading,
    addLeafletCSS,
    addMarkerStyles,
    addLikeStyles,
  });

  useCreateMarkerOnConfirmation({
    userConfirmedProblem,
    selectedProblemType,
    mapInstanceRef,
    userLocationMarkerRef,
    leafletRef,
    iconsRef,
    setMarkers,
    resetConfirmation,
  });

  useMapResizeHandler(mapInstanceRef);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />;
};

export { MapContent };