import { getProblemLabel } from "@/utils/map-utils";
import { createMapIcons } from "@/utils/marker-icons";
import { convertToDate } from "@/utils/marker-interactions";

type MapInitializerProps = {
  mapRef: React.RefObject<HTMLDivElement | null>;  // Corrigido para aceitar HTMLDivElement | null
  mapInstanceRef: React.MutableRefObject<any>;
  userLocationMarkerRef: React.MutableRefObject<any>;
  leafletRef: React.MutableRefObject<any>;
  iconsRef: React.MutableRefObject<Record<string, any>>;
  defaultLocation: [number, number];
  defaultZoom: number;
  loadMarkersFromFirebase: () => Promise<any[]>;
  onLikeMarker: (marker: any) => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addLeafletCSS: () => void;
  addMarkerStyles: () => void;
  addLikeStyles: () => void;
};

export const initializeMap = async ({
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
}: MapInitializerProps) => {
  try {
    // Verificar se o elemento do mapa existe
    if (!mapRef.current) {
      console.error("Elemento do mapa não encontrado");
      setIsLoading(false);
      return;
    }

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
      iconsRef.current = createMapIcons(L);
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
        const icon = iconsRef.current[marker.type] || iconsRef.current.default;
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
          onLikeMarker(marker);
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
    }

    // Force size recalculation
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 100);

    setIsLoading(false);
    return mapInstance;
  } catch (error) {
    console.error("Erro ao inicializar o mapa:", error);
    setIsLoading(false);
    throw error;
  }
};

export const setupLocationTracking = (
  mapInstanceRef: React.MutableRefObject<any>,
  userLocationMarkerRef: React.MutableRefObject<any>,
  defaultZoom: number
) => {
  if (!("geolocation" in navigator)) {
    return null;
  }

  return navigator.geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;

      // Update map view to follow user
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(
          [latitude, longitude],
          mapInstanceRef.current.getZoom()
        );
      }

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
};