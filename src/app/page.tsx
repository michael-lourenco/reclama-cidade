"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Search, Locate, Menu, AlertTriangle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeafletMouseEvent } from 'leaflet';
import { UserMarker } from "@/application/entities/User";
import { Marker } from "@/application/entities/Marker";
import { v4 as uuidv4 } from 'uuid';

import {
  addMarker,
  addUserMarker,
  dbFirestore,
  UserData,
} from "@/services/firebase/FirebaseService";
export default function MinhaRota() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Logando...</p>
      </div>
    );
  }

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null)  ? (
        <div className="relative w-full h-screen">
          <MapFullScreen />
        </div>):( 
          <div className="flex flex-col text-primary mb-4 p-4 bg-baclkground rounded-lg">
            <div className="grid grid-cols-[1fr,auto] items-center gap-2">
              <Button onClick={handleLogin} variant="default">
                Sign in with Google
              </Button>
            </div>
          </div>        
        )}
    </>
  );
}

// Define tipos para os problemas
const PROBLEM_TYPES = {
  BURACO: 'buraco',
  ALAGAMENTO: 'alagamento',
  ILUMINACAO: 'iluminacao'
};

// Interface para os marcadores salvos
// interface SavedMarker {
//   lat: number;
//   lng: number;
//   type: string;
//   createdAt: number;
// }

const MapFullScreen = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null);
  const [userConfirmedProblem, setUserConfirmedProblem] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (reportMenuOpen) setReportMenuOpen(false);
  };

  const toggleReportMenu = () => {
    setReportMenuOpen(!reportMenuOpen);
  };

  const handleProblemSelect = (problemType: string) => {
    setSelectedProblemType(problemType);
  };

  const handleConfirmProblem = () => {
    setUserConfirmedProblem(true);
    setReportMenuOpen(false);
  };

  // Reset confirmation state after it's been processed
  useEffect(() => {
    if (userConfirmedProblem) {
      // This will be reset by the child component after processing
      const timer = setTimeout(() => {
        setUserConfirmedProblem(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userConfirmedProblem]);

  return (
    <>
      {!isClient || isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Carregando mapa...</span>
        </div>
      ) : null}
      
      {isClient && (
        <MapContent 
          setIsLoading={setIsLoading}
          selectedProblemType={selectedProblemType}
          userConfirmedProblem={userConfirmedProblem}
          resetConfirmation={() => setUserConfirmedProblem(false)}
        />
      )}
      
      {/* Top Bar - Search */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
        <Button 
          variant="default" 
          size="icon" 
          className="bg-white text-black hover:bg-gray-100 shadow-md" 
          onClick={toggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Pesquisar localização..."
            className="w-full bg-white shadow-md pr-10"
            onKeyDown={(e) => e.key === "Enter" && console.log("search")}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full" 
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Bottom Right - Location Controls */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
        <Button 
          variant="default" 
          size="icon" 
          className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12" 
          title="Usar minha localização"
        >
          <Locate className="h-5 w-5" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12" 
          title="Reportar problema"
          onClick={toggleReportMenu}
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Side Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transition-all">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Mapa de Problemas</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Meus Reportes</li>
              <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Configurações</li>
              <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Ajuda</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Report Problem Menu */}
      {reportMenuOpen && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-20 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Reportar Problema</h3>
            <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div 
              className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.BURACO ? 'bg-gray-100' : ''}`}
              onClick={() => handleProblemSelect(PROBLEM_TYPES.BURACO)}
            >
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-xs">Buraco</span>
            </div>
            <div 
              className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.ALAGAMENTO ? 'bg-gray-100' : ''}`}
              onClick={() => handleProblemSelect(PROBLEM_TYPES.ALAGAMENTO)}
            >
              <div className="bg-yellow-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-xs">Alagamento</span>
            </div>
            <div 
              className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === PROBLEM_TYPES.ILUMINACAO ? 'bg-gray-100' : ''}`}
              onClick={() => handleProblemSelect(PROBLEM_TYPES.ILUMINACAO)}
            >
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs">Iluminação</span>
            </div>
          </div>
          <Button 
            className="w-full text-black"
            disabled={!selectedProblemType}
            onClick={handleConfirmProblem}
          >
            Confirmar Problema
          </Button>
        </div>
      )}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm">
          Clique no mapa para selecionar uma localização
        </div>
      </div>
    </>
  );
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
  const { user, loading, status, handleLogin, handleLogout } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const iconsRef = useRef<Record<string, any>>({});
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 15;
  const LOCAL_STORAGE_KEY = 'mapProblems';

  // Memoize functions that don't need to be recreated on every render
  const getProblemLabel = useCallback((type: string): string => {
    switch (type) {
      case PROBLEM_TYPES.BURACO:
        return 'Buraco';
      case PROBLEM_TYPES.ALAGAMENTO:
        return 'Alagamento';
      case PROBLEM_TYPES.ILUMINACAO:
        return 'Iluminação';
      default:
        return 'Desconhecido';
    }
  }, []);

  const saveMarkerToLocalStorage = useCallback((markerData: UserMarker) => {
    try {
      // Obter marcadores existentes
      const existingMarkers = localStorage.getItem(LOCAL_STORAGE_KEY);
      let markers: UserMarker[] = existingMarkers ? JSON.parse(existingMarkers) : [];
      
      // Adicionar novo marcador
      markers.push(markerData);
      
      // Salvar de volta no localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(markers));
      
      console.log('Marcador salvo com sucesso:', markerData);
    } catch (error) {
      console.error('Erro ao salvar marcador no localStorage:', error);
    }
  }, []);

  const loadMarkersFromLocalStorage = useCallback((): UserMarker[] => {
    try {
      const savedMarkers = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedMarkers ? JSON.parse(savedMarkers) : [];
    } catch (error) {
      console.error('Erro ao carregar marcadores do localStorage:', error);
      return [];
    }
  }, []);

  // Handle confirmed problem selection and marker update
  useEffect(() => {
    if (!userConfirmedProblem || !selectedProblemType || !mapInstanceRef.current || !currentMarkerRef.current || !leafletRef.current) {
      return;
    }
    
    // Get current position
    const markerPosition = currentMarkerRef.current.getLatLng();
    
    // Remove current marker
    mapInstanceRef.current.removeLayer(currentMarkerRef.current);
    
    // Add new marker with custom icon
    const L = leafletRef.current;
    const newMarker = L.marker([markerPosition.lat, markerPosition.lng], { 
      icon: iconsRef.current[selectedProblemType] 
    }).addTo(mapInstanceRef.current);
    
    newMarker.bindPopup(`Problema: ${getProblemLabel(selectedProblemType)}`).openPopup();
    
    if(user && user.email) {
    // Save to localStorage
      const userMarkerData: UserMarker = {
        id: uuidv4(),
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        type: selectedProblemType,
        createdAt: new Date()
      };
      


      const markerData: Marker = {
        id: uuidv4(),
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        type: selectedProblemType,
        userEmail: user.email!,
        createdAt: new Date()
      };

      saveMarkerToLocalStorage(userMarkerData);
    
      addUserMarker(dbFirestore, user.email!, userMarkerData );
      addMarker(dbFirestore, markerData );
    }
    
    // Update current marker reference
    currentMarkerRef.current = newMarker;
    
    // Reset confirmation flag
    resetConfirmation();
    
  }, [userConfirmedProblem, selectedProblemType, getProblemLabel, saveMarkerToLocalStorage, resetConfirmation]);

  // Initialize map only once
  useEffect(() => {
    // Add Leaflet CSS
    const addLeafletCSS = () => {
      if (document.querySelector('link[href*="leaflet.css"]')) return;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    };
    
    // Add CSS for marker icons
    const addMarkerStyles = () => {
      if (document.querySelector('style[data-id="marker-styles"]')) return;
      
      const style = document.createElement('style');
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
      `;
      document.head.appendChild(style);
    };
    
    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      try {
        // Add required styles
        addLeafletCSS();
        addMarkerStyles();
        
        // Load Leaflet library only once
        if (!leafletRef.current) {
          const L = await import("leaflet");
          leafletRef.current = L;
        }
        
        const L = leafletRef.current;
        console.log("Inicializando mapa Leaflet");
        
        // Create custom icons once
        if (Object.keys(iconsRef.current).length === 0) {
          const defaultIcon = new L.Icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          
          const buracoIcon = new L.Icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: 'buraco-icon'
          });
          
          const alagamentoIcon = new L.Icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: 'alagamento-icon'
          });
          
          const iluminacaoIcon = new L.Icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: 'iluminacao-icon'
          });
          
          iconsRef.current = {
            [PROBLEM_TYPES.BURACO]: buracoIcon,
            [PROBLEM_TYPES.ALAGAMENTO]: alagamentoIcon,
            [PROBLEM_TYPES.ILUMINACAO]: iluminacaoIcon,
            default: defaultIcon
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
        
        // Load saved markers
        const savedMarkers = loadMarkersFromLocalStorage();
        
        if (savedMarkers.length > 0) {
          // Add all saved markers to the map
          savedMarkers.forEach((marker: UserMarker) => {
            const icon = iconsRef.current[marker.type] || iconsRef.current.default;
            const mapMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(mapInstance);
            
            // Add popup with information
            const date = new Date(marker.createdAt);
            mapMarker.bindPopup(`
              <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
              Reportado em: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
            `);
          });
          
          // Center map on most recent marker
          const mostRecent = savedMarkers.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
          mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom);
        } else {
          // Add default marker if no saved markers
          const tempMarker = L.marker(defaultLocation, { icon: iconsRef.current.default })
            .addTo(mapInstance)
            .bindPopup("Clique para reportar um problema")
            .openPopup();
            
          currentMarkerRef.current = tempMarker;
        }
        
        // Allow clicking on map to add/move marker
        mapInstance.on("click", (e: LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          
          if (currentMarkerRef.current) {
            mapInstance.removeLayer(currentMarkerRef.current);
          }
          
          // Create new temporary marker
          const newMarker = L.marker([lat, lng], { icon: iconsRef.current.default })
            .addTo(mapInstance)
            .bindPopup("Clique em 'Reportar problema' para identificar o tipo")
            .openPopup();
            
          currentMarkerRef.current = newMarker;
        });
        
        // Get user location if no saved markers
        if (savedMarkers.length === 0 && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              
              // Update map view
              mapInstance.setView([latitude, longitude], defaultZoom);
              
              // Move existing marker
              if (currentMarkerRef.current) {
                currentMarkerRef.current.setLatLng([latitude, longitude]);
                currentMarkerRef.current.bindPopup("Sua localização").openPopup();
              }
            },
            (error) => {
              console.error("Erro ao obter localização do usuário:", error);
            }
          );
        }
        
        // Force size recalculation
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 100);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        setIsLoading(false);
      }
    }
    
    initMap();
    
    return () => {
      if (mapInstanceRef.current) {
        console.log("Limpando mapa");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loadMarkersFromLocalStorage, getProblemLabel]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
  );
};
