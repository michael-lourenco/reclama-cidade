"use client";
import type { Marker } from "@/types/marker-types";
import { useMarkers } from "@/hooks/use-markers";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useMarkerStyles } from "@/utils/marker-styles";
import { handleLikeMarker } from "@/utils/marker-interactions";
import { initializeMap, setupLocationTracking } from "@/utils/map-initializer";
import { addLeafletCSS, addLikeStyles, setupCenterOnUserEvent, setupResizeHandler } from "@/utils/map-styles";
import { createAndSaveMarker } from "@/utils/marker-creator";

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

  // Initialize map only once
  useEffect(() => {
    // Verificação principal para evitar múltiplas inicializações
    if (!mapRef.current || mapInitializedRef.current) {
      return;
    }

    // Marcar que a inicialização começou
    mapInitializedRef.current = true;

    let watchId: number | null = null;

    async function initMap() {
      try {
        await initializeMap({
          mapRef,
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

        // Set up continuous location tracking
        watchId = setupLocationTracking(
          mapInstanceRef,
          userLocationMarkerRef,
          defaultZoom
        );
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        // Resetar flag se houver erro para permitir tentar novamente
        mapInitializedRef.current = false;
      }
    }

    initMap();

    // Configurar evento de centralização no usuário
    const cleanupCenterOnUserEvent = setupCenterOnUserEvent(
      mapInstanceRef,
      userLocationMarkerRef,
      defaultZoom
    );

    return () => {
      cleanupCenterOnUserEvent();
      
      // Clean up location tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapInitializedRef.current = false;
      }
    };
  }, [
    loadMarkersFromFirebase,
    addMarkerStyles,
  ]);

  // Handle confirmed problem selection and marker update
  useEffect(() => {
    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !userLocationMarkerRef.current ||
      !leafletRef.current
    ) {
      return;
    }

    // Get current position of user marker
    const markerPosition = userLocationMarkerRef.current.getLatLng();

    // Criar e salvar marcador
    createAndSaveMarker({
      markerPosition,
      selectedProblemType,
      iconsRef,
      mapInstanceRef,
      leafletRef,
      setMarkers
    });

    // Reset confirmation flag
    resetConfirmation();
  }, [
    userConfirmedProblem,
    selectedProblemType,
    resetConfirmation,
    setMarkers,
  ]);

  // Handle window resize
  useEffect(() => {
    return setupResizeHandler(mapInstanceRef);
  }, []);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />;
};

export { MapContent };