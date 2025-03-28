"use client";
import type { Marker } from "@/application/entities/Marker";
import { PROBLEM_TYPES } from "@/constants/map-constants";
import { useMarkers } from "@/hooks/use-markers";
import { addMarker, dbFirestore, updateMarkerLikes } from "@/services/firebase/FirebaseService";
import { getProblemLabel } from "@/utils/map-utils";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDistance } from '@/utils/distance-utils';

// Função utilitária para conversão de timestamps
const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    // Firestore Timestamp object
    return new Date(timestamp.seconds * 1000);
  }
  
  // Fallback para outros formatos de timestamp
  return new Date(timestamp);
};

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

  // Função para obter o email do usuário atual
  const getCurrentUserEmail = () => {
    const userDataString = localStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    return userData?.email || null;
  };

  // Handle marker like functionality
  const handleLikeMarker = async (marker: Marker) => {
    try {
      const userEmail = getCurrentUserEmail();
      
      if (!userEmail) {
        alert("Por favor, faça login para curtir um marcador.");
        return;
      }

      // Verificar distância do usuário ao marcador
      if (!userLocationMarkerRef.current) {
        alert("Localização do usuário não disponível.");
        return;
      }

      const userLocation = userLocationMarkerRef.current.getLatLng();
      const markerLocation = { lat: marker.lat, lng: marker.lng };
      const distance = getDistance(userLocation, markerLocation);

      // Verificar se o usuário está dentro de 100 metros
      if (distance > 100) {
        alert("Você precisa estar a até 100 metros do marcador para curtir.");
        return;
      }

      // Verificar se o usuário está tentando curtir seu próprio marcador
      if (marker.userEmail === userEmail) {
        alert("Você não pode curtir seu próprio marcador.");
        return;
      }

      // Verificar se o usuário já curtiu o marcador
      if (marker.likedBy?.includes(userEmail)) {
        alert("Você já curtiu este marcador.");
        return;
      }

      // Atualizar likes no Firebase
      await updateMarkerLikes(dbFirestore, marker.id, userEmail);

      // Atualizar estado local dos marcadores
      const updatedMarkers = markers.map(m => 
        m.id === marker.id 
          ? { ...m, likedBy: m.likedBy ? [...m.likedBy, userEmail] : [userEmail] }
          : m
      );
      setMarkers(updatedMarkers);
    } catch (error) {
      console.error("Erro ao curtir marcador:", error);
      alert("Não foi possível curtir o marcador. Tente novamente.");
    }
  };

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

  // Add CSS for marker icons
  const addMarkerStyles = useCallback(() => {
    if (document.querySelector('style[data-id="marker-styles"]')) return;

    const style = document.createElement("style");
    style.dataset.id = "marker-styles";
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
      .blitz-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }
      .pista-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }
      .bueiro-aberto-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }
      .bueiro-vazamento-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }
      .semafaro-icon {
        filter: hue-rotate(120deg); /* Green color for user location */
        animation: pulse 1.5s infinite;
      }
          
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

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
        // Add required styles
        addLeafletCSS();
        addMarkerStyles();
        addLikeStyles();

        // Load Leaflet library only once
        if (!leafletRef.current) {
          const L = await import("leaflet");
          leafletRef.current = L;
        }

        const L = leafletRef.current;
        console.log("Inicializando mapa Leaflet");

        // Verificação adicional antes da criação do mapa
        if (mapInstanceRef.current) {
          console.log("Mapa já existe, pulando inicialização");
          setIsLoading(false);
          return;
        }

        // Create custom icons once
        if (Object.keys(iconsRef.current).length === 0) {
          const defaultIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          const buracoIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "buraco-icon",
          });

          const alagamentoIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "alagamento-icon",
          });

          const iluminacaoIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "iluminacao-icon",
          });

          const blitzIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "blitz-icon",
          });

          const pistaIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "pista-icon",
          });          

          const bueiroAbertoIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "bueiro-aberto-icon",
          });

          const bueiroVazamentoIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "bueiro-vazamento-icon",
          });

          const semafaroIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "semafaro-icon",
          });

          const userLocationIcon = new L.Icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: "user-location-icon",
          });

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
          };
        }

        // Initialize map
        const mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView(defaultLocation, defaultZoom);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstance);

        // Store map instance
        mapInstanceRef.current = mapInstance;

        // Load markers from Firebase
        const firebaseMarkers = await loadMarkersFromFirebase();

        if (firebaseMarkers && firebaseMarkers.length > 0) {
          // Add all saved markers to the map
          firebaseMarkers.forEach(marker => {
            const icon =
              iconsRef.current[marker.type] || iconsRef.current.default;
            const mapMarker = L.marker([marker.lat, marker.lng], {
              icon,
            }).addTo(mapInstance);

            // Converter timestamp de forma segura
            const createdAt = convertToDate(marker.createdAt);

            // Criar popup personalizado com botão de like
            const popupContent = document.createElement('div');
            popupContent.classList.add('marker-popup');
            popupContent.innerHTML = `
              <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
              Reportado em: ${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}<br>
              Por: ${marker.userEmail || "Usuário anônimo"}<br>
              <button class="like-button">
                Curtir 
                <span class="like-count">(${marker.likedBy?.length || 0})</span>
              </button>
            `;

            // Adicionar evento de clique no botão de like
            popupContent.querySelector('.like-button')?.addEventListener('click', () => {
              handleLikeMarker(marker);
            });

            mapMarker.bindPopup(popupContent);
          });

          // Center map on most recent marker
          // Ordenar marcadores por data descendente (mais recente primeiro)
          const sortedMarkers = [...firebaseMarkers].sort((a, b) => {
            const dateA = convertToDate(a.createdAt);
            const dateB = convertToDate(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });

          if (sortedMarkers.length > 0) {
            const mostRecent = sortedMarkers[0];
            mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom);
          }
        }

        // Get user location and continuously track it
        if ("geolocation" in navigator) {
          // First get initial position
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;

              // Update map view
              mapInstance.setView([latitude, longitude], defaultZoom);

              // Create user location marker
              const userIcon = iconsRef.current.userLocation;

              userLocationMarkerRef.current = L.marker([latitude, longitude], {
                icon: userIcon,
                zIndexOffset: 1000, // Make sure user marker is on top
              })
                .addTo(mapInstance)
                .bindPopup("Sua localização")
                .openPopup();
            },
            error => {
              console.error("Erro ao obter localização do usuário:", error);

              // Cria o marcador na posição padrão se não conseguir obter a localização
              const userIcon = iconsRef.current.userLocation;
              userLocationMarkerRef.current = L.marker(defaultLocation, {
                icon: userIcon,
                zIndexOffset: 1000,
              })
                .addTo(mapInstance)
                .bindPopup("Sua localização (aproximada)")
                .openPopup();
            }
          );

          // Then set up continuous tracking
          const watchId = navigator.geolocation.watchPosition(
            position => {
              const { latitude, longitude } = position.coords;

              // Update map view to follow user
              mapInstance.setView([latitude, longitude], mapInstance.getZoom());

              // Update user marker position
              if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setLatLng([latitude, longitude]);
              }
            },
            error => {
              console.error("Erro ao rastrear localização do usuário:", error);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000,
            }
          );

          // Clean up the watch when component unmounts
          return () => {
            navigator.geolocation.clearWatch(watchId);
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove();
              mapInstanceRef.current = null;
              mapInitializedRef.current = false;
            }
          };
        }

        // Force size recalculation
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 100);

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        setIsLoading(false);
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