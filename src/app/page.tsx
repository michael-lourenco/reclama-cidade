"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Locate, Menu, AlertTriangle, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MinhaRota() {
  return (
    <div className="relative w-full h-screen">
      <MapFullScreen />
    </div>
  );
}

const MapFullScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  
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
            <div className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-xs">Buraco</span>
            </div>
            <div className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="bg-yellow-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-xs">Alagamento</span>
            </div>
            <div className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs">Iluminação</span>
            </div>
          </div>
          <Button className="w-full">Confirmar Localização</Button>
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
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 15;

  useEffect(() => {
    // Adicionar os estilos do Leaflet ao documento
    const addLeafletCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    };
    
    addLeafletCSS();
    
    if (!mapRef.current) return;

    // Importar dinamicamente o Leaflet
    import("leaflet").then((L) => {
      // Se já temos um mapa, não faça nada
      if (map) return;

      // Criar ícones personalizados para garantir que apareçam
      const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Inicializar o mapa
      console.log("Inicializando mapa Leaflet");
      
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false, // Remove zoom controls
        attributionControl: false // Remove attribution
      }).setView(defaultLocation, defaultZoom);

      // Adicionar o tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapInstance);

      // Adicionar marcador padrão
      const defaultMarker = L.marker(defaultLocation, { icon: customIcon }).addTo(mapInstance);
      defaultMarker.bindPopup("Localização padrão").openPopup();
      setMarker(defaultMarker);

      // Permitir clicar no mapa para adicionar/mover o marcador
      mapInstance.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (marker) {
          marker.setLatLng([lat, lng]);
          marker.openPopup();
        } else {
          const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance);
          newMarker.bindPopup("Localização selecionada").openPopup();
          setMarker(newMarker);
        }
      });
      
      // Atualizar estado
      setMap(mapInstance);
      setIsLoading(false);
      
      // Obter localização do usuário
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Atualizar o mapa
            mapInstance.setView([latitude, longitude], defaultZoom);
            
            // Mover o marcador existente
            if (defaultMarker) {
              defaultMarker.setLatLng([latitude, longitude]);
              defaultMarker.bindPopup("Sua localização").openPopup();
            }
          },
          (error) => {
            console.error("Erro ao obter localização do usuário:", error);
            // Já temos o marcador padrão, então não precisamos fazer nada aqui
          }
        );
      }

      // Forçar recálculo de tamanho após a renderização completa
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    });

    // Limpeza
    return () => {
      if (map) {
        console.log("Limpando mapa");
        map.remove();
      }
    };
  }, [mapRef.current]);

  // Função para centralizar na localização do usuário
  const getUserLocation = () => {
    if (!map) return;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Atualizar o mapa
          map.setView([latitude, longitude], defaultZoom);
          
          // Mover o marcador existente
          if (marker) {
            marker.setLatLng([latitude, longitude]);
            marker.bindPopup("Sua localização").openPopup();
          }
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  };

  // Evento de redimensionamento
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        map.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return (
    <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
  );
};