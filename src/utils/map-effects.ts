import { MutableRefObject, useEffect } from "react";
import { Marker } from "@/types/marker-types";
import { setupLocationTracking } from "@/utils/map-initializer";
import { setupCenterOnUserEvent, setupResizeHandler } from "@/utils/map-styles";
import { createAndSaveMarker } from "@/utils/marker-creator";
import { initializeMap } from "@/utils/map-initializer";

// Hook para inicializar o mapa
export function useMapInitialization({
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
}: {
  mapRef: MutableRefObject<HTMLDivElement | null>;
  mapInitializedRef: MutableRefObject<boolean>;
  mapInstanceRef: MutableRefObject<any>;
  userLocationMarkerRef: MutableRefObject<any>;
  leafletRef: MutableRefObject<any>;
  iconsRef: MutableRefObject<Record<string, any>>;
  defaultLocation: [number, number];
  defaultZoom: number;
  loadMarkersFromFirebase: () => Promise<Marker[]>;  // Corrigido o tipo para Promise<Marker[]>
  onLikeMarker: (marker: any) => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addLeafletCSS: () => void;
  addMarkerStyles: () => void;
  addLikeStyles: () => void;
}) {
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
    setIsLoading,
    defaultLocation,
    defaultZoom,
    addLeafletCSS,
    addLikeStyles,
  ]);
}

// Hook para lidar com a criação de marcadores quando o usuário confirma um problema
export function useCreateMarkerOnConfirmation({
  userConfirmedProblem,
  selectedProblemType,
  mapInstanceRef,
  userLocationMarkerRef,
  leafletRef,
  iconsRef,
  setMarkers,
  resetConfirmation,
}: {
  userConfirmedProblem: boolean;
  selectedProblemType: string | null;
  mapInstanceRef: MutableRefObject<any>;
  userLocationMarkerRef: MutableRefObject<any>;
  leafletRef: MutableRefObject<any>;
  iconsRef: MutableRefObject<Record<string, any>>;
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>;
  resetConfirmation: () => void;
}) {
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
    mapInstanceRef,
    userLocationMarkerRef,
    leafletRef,
    iconsRef,
  ]);
}

// Hook para lidar com o redimensionamento da janela
export function useMapResizeHandler(mapInstanceRef: MutableRefObject<any>) {
  useEffect(() => {
    return setupResizeHandler(mapInstanceRef);
  }, [mapInstanceRef]);
}