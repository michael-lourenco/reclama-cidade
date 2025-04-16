"use client";
import { useMarkers } from "@/components/marker/use-markers";
import type React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useMarkerStyles } from "@/components/marker/use-marker-styles";
import { handleLikeMarker, handleResolvedMarker } from "@/components/marker/marker-interactions";
import { initializeMap, setupLocationTracking } from "@/components/map/map-initializer";
import { addLeafletCSS, addLikeStyles, setupCenterOnUserEvent, setupResizeHandler } from "@/components/map/map-styles";
import { createAndSaveMarker } from "@/components/marker/marker-creator";
import { LocationControls } from "@/components/location-controls/location-controls";
import { MarkerFilter } from "@/components/marker/marker-filter";

const MapContent = ({
  setIsLoading,
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu,
  selectedTypes,
  onFilterChange
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProblemType: string | null;
  userConfirmedProblem: boolean;
  resetConfirmation: () => void;
  toggleReportMenu: () => void;
  selectedTypes: string[];
  onFilterChange: (selectedTypes: string[]) => void;
}) => {
  const { markers, setMarkers, loadMarkersFromFirebase, markerTypes, getFilteredMarkers } = useMarkers();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const iconsRef = useRef<Record<string, any>>({});
  const mapInitializedRef = useRef<boolean>(false);
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 16;
  const watchIdRef = useRef<number | null>(null);
  
  // Referência para armazenar os marcadores do Leaflet
  const markersLayerRef = useRef<any>(null);
  
  // Flag to track if initial centering on user has happened
  const initialCenteringDoneRef = useRef<boolean>(false);

  // Track if location follow mode is active
  const [followMode, setFollowMode] = useState<boolean>(true);

  // Add CSS for marker icons
  const addMarkerStyles = useMarkerStyles();

  // Filter markers based on selected types
  const filteredMarkers = useMemo(() => {
    return getFilteredMarkers(selectedTypes);
  }, [getFilteredMarkers, selectedTypes, markers]);

  const onLikeMarker = async (marker: any) => {
    await handleLikeMarker(marker, userLocationMarkerRef.current, markers, setMarkers);
  };

  const onResolvedMarker = async (marker: any) => {
    await handleResolvedMarker(marker, userLocationMarkerRef.current, markers, setMarkers);
  };

  // Center on user location manually (one-time centering)
  const centerOnUserLocation = () => {
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      const position = userLocationMarkerRef.current.getLatLng();
      mapInstanceRef.current.setView([position.lat, position.lng], mapInstanceRef.current.getZoom());
    }
  };
  
  // Função para atualizar os marcadores no mapa com base nos filtros
  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !leafletRef.current || !iconsRef.current || !filteredMarkers) {
      return;
    }
    
    // Se já existe uma camada de marcadores, remova-a completamente
    if (markersLayerRef.current) {
      mapInstanceRef.current.removeLayer(markersLayerRef.current);
    }
    
    // Crie uma nova camada de grupo para os marcadores
    markersLayerRef.current = new leafletRef.current.LayerGroup();
    
    // Adicione apenas os marcadores filtrados à nova camada
    filteredMarkers.forEach(marker => {
      const { lat, lng, type } = marker;
      
      // Skip if we don't have coordinates or type
      if (lat === undefined || lng === undefined || !type) {
        return;
      }
      
      // Get the appropriate icon for this marker type
      const icon = iconsRef.current[type] || iconsRef.current.default;
      
      // Create the marker with the icon
      const leafletMarker = leafletRef.current.marker([lat, lng], { icon });
      
      // Store the marker data with the Leaflet marker
      leafletMarker.markerData = marker;
      
      // Add popup with marker info and interaction buttons
      const popupContent = document.createElement('div');
      popupContent.className = 'marker-popup';
      popupContent.innerHTML = `
        <div class="marker-info">
          <p><strong>Tipo:</strong> ${type}</p>
          <p><strong>Reportado por:</strong> ${marker.userEmail || 'Anônimo'}</p>
          <p><strong>Status:</strong> ${marker.currentStatus || 'Reportado'}</p>
          <div class="marker-actions">
            <button class="like-button">👍 ${(marker.likedBy?.length || 0)}</button>
            <button class="resolved-button">✅ ${(marker.resolvedBy?.length || 0)}</button>
          </div>
        </div>
      `;
      
      // Create and bind popup
      const popup = leafletRef.current.popup().setContent(popupContent);
      leafletMarker.bindPopup(popup);
      
      // Add event listeners for the buttons
      leafletMarker.on('popupopen', () => {
        const likeButton = document.querySelector('.like-button');
        const resolvedButton = document.querySelector('.resolved-button');
        
        if (likeButton) {
          likeButton.addEventListener('click', () => onLikeMarker(marker));
        }
        
        if (resolvedButton) {
          resolvedButton.addEventListener('click', () => onResolvedMarker(marker));
        }
      });
      
      // Adicione o marcador à camada de grupo
      leafletMarker.addTo(markersLayerRef.current);
    });
    
    // Adicione a camada de grupo ao mapa
    markersLayerRef.current.addTo(mapInstanceRef.current);
  };
  
  // Atualizar marcadores quando os filtros mudarem ou quando os marcadores forem carregados
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && iconsRef.current) {
      updateMapMarkers();
    }
  }, [filteredMarkers]);

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

        // Modificar o objeto de opções para inicialização do mapa para não adicionar marcadores
        const initOptions = {
          mapRef,
          mapInstanceRef,
          userLocationMarkerRef,
          leafletRef,
          iconsRef,
          defaultLocation: initialLocation,
          defaultZoom,
          loadMarkersFromFirebase,
          onLikeMarker,
          onResolvedMarker,
          setIsLoading,
          addLeafletCSS,
          addMarkerStyles,
          addLikeStyles,
          skipUserLocationSetView: initialCenteringDoneRef.current,
          skipMarkersAddition: true // Adicione esta opção para pular a adição de marcadores na inicialização
        };

        // Initialize map with the best available location (user or default)
        await initializeMap(initOptions);

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
        
        // Após a inicialização do mapa, atualize os marcadores com base nos filtros
        updateMapMarkers();
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
      
      // Limpar a camada de marcadores
      if (markersLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
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
        toggleReportMenu={toggleReportMenu}
      />
      
      {/* Componente de filtro de marcadores */}
      <div className="absolute top-4 right-4 z-[1000]">
        <MarkerFilter 
          availableTypes={markerTypes}
          selectedTypes={selectedTypes}
          onFilterChange={onFilterChange}
        />
      </div>
    </>
  );
};

export { MapContent };