"use client";
import type { Marker } from "@/types/marker-types";
import { useMarkers } from "@/hooks/use-markers";
import { addMarker, dbFirestore } from "@/services/firebase/FirebaseService";
import { getProblemLabel } from "@/utils/map-utils";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMarkerStyles } from "@/utils/marker-styles"
import { handleLikeMarker, convertToDate } from "@/utils/marker-interactions"
import { initializeMap, setupLocationTracking } from "@/utils/map-initializer";

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
  const addMarkerStyles = useMarkerStyles()

  const onLikeMarker = async (marker: any) => {
    await handleLikeMarker(marker, userLocationMarkerRef.current, markers, setMarkers)
  }

  // Adicionar novos estilos para o botão de like
  const addLikeStyles = useCallback(() => {
    if (document.querySelector('style[data-id="like-styles"]')) return;

    const style = document.createElement("style");
    style.dataset.id = "like-styles";
    style.textContent = `
      .marker-popup .like-button {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .marker-popup .like-button:hover {
        background-color: #e0e0e0;
      }
      .marker-popup .like-count {
        margin-left: 5px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Add Leaflet CSS
  const addLeafletCSS = useCallback(() => {
    if (document.querySelector('link[href*="leaflet.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);
  }, []);

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

    // Add event listener for centering on user
    const handleCenterOnUser = (e: CustomEvent) => {
      if (mapInstanceRef.current && userLocationMarkerRef.current) {
        const latlng = userLocationMarkerRef.current.getLatLng();
        mapInstanceRef.current.setView([latlng.lat, latlng.lng], defaultZoom);
      }
    };

    document.addEventListener(
      "centerOnUser",
      handleCenterOnUser as EventListener
    );

    return () => {
      document.removeEventListener(
        "centerOnUser",
        handleCenterOnUser as EventListener
      );
      
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
    getProblemLabel,
    addLeafletCSS,
    addMarkerStyles,
    addLikeStyles,
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

    // Salvar o marcador no Firebase
    const saveMarkerToFirebase = async () => {
      try {
        // Obter informações do usuário atual do localStorage
        const userDataString = localStorage.getItem("user");
        const userData = userDataString ? JSON.parse(userDataString) : null;
        const userEmail = userData?.email || "Usuário anônimo";

        // Criar objeto de marcador para salvar
        const markerId = `marker_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        const newMarkerData: Marker = {
          id: markerId,
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          type: selectedProblemType,
          userEmail,
          createdAt: new Date(),
          likedBy: [] // Inicializa como um array vazio
        };

        // Adicionar ao Firebase usando o FirebaseService
        await addMarker(dbFirestore, newMarkerData);
        console.log("Marcador salvo com sucesso:", newMarkerData);

        // Atualizar o estado local de marcadores
        setMarkers(prev => [...prev, newMarkerData]);

        // Adicionar marker no mapa com o ícone correto (mas manter o user location marker)
        const L = leafletRef.current;
        const newMarker = L.marker([markerPosition.lat, markerPosition.lng], {
          icon: iconsRef.current[selectedProblemType],
        }).addTo(mapInstanceRef.current);

        // Criar popup personalizado com botão de like
        const popupContent = document.createElement('div');
        popupContent.classList.add('marker-popup');
        popupContent.innerHTML = `
          <strong>Problema: ${getProblemLabel(selectedProblemType)}</strong><br>
          Reportado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}<br>
          Por: ${userEmail}<br>
          <button class="like-button">
            Curtir 
            <span class="like-count">(0)</span>
          </button>
        `;

        newMarker
          .bindPopup(popupContent)
          .openPopup();
      } catch (error) {
        console.error("Erro ao salvar marcador no Firebase:", error);
      }
    };

    // Executar a função de salvamento
    saveMarkerToFirebase();

    // Reset confirmation flag
    resetConfirmation();
  }, [
    userConfirmedProblem,
    selectedProblemType,
    getProblemLabel,
    resetConfirmation,
    setMarkers,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />;
};

export { MapContent };