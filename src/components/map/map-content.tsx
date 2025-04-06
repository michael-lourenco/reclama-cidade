"use client";

import { useMarkers } from "@/hooks/use-markers";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useMarkerStyles } from "@/hooks/marker-styles";
import { handleLikeMarker, handleResolvedMarker } from "@/utils/marker-interactions";
import { initializeMap, setupLocationTracking } from "@/utils/map-initializer";
import { addLeafletCSS, addLikeStyles, setupCenterOnUserEvent, setupResizeHandler } from "@/utils/map-styles";
import { createAndSaveMarker } from "@/utils/marker-creator";
import { LocationControls } from "@/components/location-controls/location-controls";

const MapContent = ({
  setIsLoading,
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProblemType: string | null;
  userConfirmedProblem: boolean;
  resetConfirmation: () => void;
  toggleReportMenu: () => void;
}) => {
  const { markers, setMarkers, loadMarkersFromFirebase } = useMarkers();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const iconsRef = useRef<Record<string, any>>({});
  const mapInitializedRef = useRef<boolean>(false);
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 16;
  const watchIdRef = useRef<number | null>(null);
  
  const initialCenteringDoneRef = useRef<boolean>(false);
  
  const [followMode, setFollowMode] = useState<boolean>(true);

  // Add CSS for marker icons
  const addMarkerStyles = useMarkerStyles();

  const onLikeMarker = async (marker: any) => {
    await handleLikeMarker(marker, userLocationMarkerRef.current, markers, setMarkers);
  };

  const onResolvedMarker = async (marker: any) => {
    await handleResolvedMarker(marker, userLocationMarkerRef.current, markers, setMarkers);
  };

  const centerOnUserLocation = () => {
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      const position = userLocationMarkerRef.current.getLatLng();
      mapInstanceRef.current.setView([position.lat, position.lng], mapInstanceRef.current.getZoom());
    }
  };

  // Initialize map only once
  useEffect(() => {
    // Verificação principal para evitar múltiplas inicializações
    if (!mapRef.current || mapInitializedRef.current) {
      return;
    }

    // Marcar que a inicialização começou
    mapInitializedRef.current = true;

    async function initMap() {
      try {
        // Get user location first, with a short timeout
        const userLocationPromise = new Promise<[number, number]>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
              console.warn("Erro ao obter localização do usuário:", error);
              reject(error);
            },
            { timeout: 3000, maximumAge: 0 }
          );
        });

        // Try to get user location first, but don't wait too long
        let initialLocation = defaultLocation;
        try {
          initialLocation = await Promise.race([
            userLocationPromise,
            new Promise<[number, number]>((_, reject) => 
              setTimeout(() => reject(new Error("Timeout")), 3000)
            )
          ]);
          initialCenteringDoneRef.current = true;
        } catch (error) {
          console.warn("Usando localização padrão para inicialização inicial:", error);
        }

        // Initialize map with the best available location (user or default)
        await initializeMap({
          mapRef,
          mapInstanceRef,
          userLocationMarkerRef,
          leafletRef,
          iconsRef,
          defaultLocation: initialLocation, // Use user location if available
          defaultZoom,
          loadMarkersFromFirebase,
          onLikeMarker,
          onResolvedMarker,
          setIsLoading,
          addLeafletCSS,
          addMarkerStyles,
          addLikeStyles,
          skipUserLocationSetView: initialCenteringDoneRef.current, // Skip the setView in initializeMap if we already have location
        });

        // Set up location tracking with auto-centering based on initial follow mode state
        watchIdRef.current = setupLocationTracking(
          mapInstanceRef,
          userLocationMarkerRef,
          defaultZoom,
          followMode // Center map on location updates if follow mode is on
        );

        // If we didn't get user location initially, try again with a longer timeout
        if (!initialCenteringDoneRef.current) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (mapInstanceRef.current && !initialCenteringDoneRef.current) {
                mapInstanceRef.current.setView([latitude, longitude], defaultZoom);
                initialCenteringDoneRef.current = true;
              }
            },
            (error) => {
              console.error("Erro secundário ao obter localização:", error);
            },
            { timeout: 10000, maximumAge: 0 }
          );
        }
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        // Resetar flag se houver erro para permitir tentar novamente
        mapInitializedRef.current = false;
      }
    }

    initMap();

    // Configure event for centering on user (original code)
    const cleanupCenterOnUserEvent = setupCenterOnUserEvent(
      mapInstanceRef,
      userLocationMarkerRef,
      defaultZoom
    );

    return () => {
      cleanupCenterOnUserEvent();
      
      // Clean up location tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapInitializedRef.current = false;
        initialCenteringDoneRef.current = false;
      }
    };
  }, [
    loadMarkersFromFirebase,
    addMarkerStyles,
    followMode // Add followMode as dependency to react to initial state
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

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
      <LocationControls
        centerOnUserLocation={centerOnUserLocation}
        followMode={false}
        toggleReportMenu={toggleReportMenu} // Added this prop
      />
    </>
  );
};

export { MapContent };