"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Locate, Menu, AlertTriangle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Map, Marker, LatLng, Icon, LeafletMouseEvent } from "leaflet";

export default function MinhaRota() {
  return (
    <div className="relative w-full h-screen">
      <MapFullScreen />
    </div>
  );
}

// Define tipos para os problemas
const PROBLEM_TYPES = {
  BURACO: 'buraco',
  ALAGAMENTO: 'alagamento',
  ILUMINACAO: 'iluminacao'
};

// Interface para os marcadores salvos
interface SavedMarker {
  lat: number;
  lng: number;
  type: string;
  createdAt: number;
}

const MapFullScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null);
  
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
    // Mantemos o menu aberto até que o usuário confirme a localização
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
          selectedProblemType={selectedProblemType}
          setReportMenuOpen={setReportMenuOpen}
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
            className="w-full"
            disabled={!selectedProblemType}
            onClick={() => {
              // Isso fechará o menu e salvará o marcador com o problema selecionado
              setReportMenuOpen(false);
              // O salvamento acontecerá no MapContent
            }}
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
  setReportMenuOpen,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProblemType: string | null;
  setReportMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [currentMarker, setCurrentMarker] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [customIcons, setCustomIcons] = useState<Record<string, Icon>>({});
  const defaultLocation: [number, number] = [-23.5902, -48.0338];
  const defaultZoom = 15;
  const LOCAL_STORAGE_KEY = 'mapProblems';

  // Efeito para lidar com a seleção de tipo de problema
  useEffect(() => {
    if (!map || !currentMarker || !selectedProblemType) return;
    
    // Importar Leaflet para usar dentro do useEffect
    import("leaflet").then((L) => {
      // Atualizar e salvar o marcador atual com o tipo de problema selecionado
      const markerPosition = currentMarker.getLatLng();
      
      // Remover o marcador atual
      map.removeLayer(currentMarker);
      
      // Adicionar novo marcador com o ícone personalizado
      if (customIcons[selectedProblemType]) {
        const newMarker = L.marker([markerPosition.lat, markerPosition.lng], { 
          icon: customIcons[selectedProblemType] 
        }).addTo(map);
        
        newMarker.bindPopup(`Problema: ${getProblemLabel(selectedProblemType)}`).openPopup();
        
        // Salvar no localStorage
        const markerData: SavedMarker = {
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          type: selectedProblemType,
          createdAt: Date.now()
        };
        
        saveMarkerToLocalStorage(markerData);
        
        // Atualizar o marcador atual
        setCurrentMarker(newMarker);
      }
      
      // Fechar o menu após salvar
      setReportMenuOpen(false);
    });
  }, [selectedProblemType, map, currentMarker]);

  // Função para obter o rótulo do problema baseado no tipo
  const getProblemLabel = (type: string): string => {
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
  };

  // Função para salvar marcador no localStorage
  const saveMarkerToLocalStorage = (markerData: SavedMarker) => {
    try {
      // Obter marcadores existentes
      const existingMarkers = localStorage.getItem(LOCAL_STORAGE_KEY);
      let markers: SavedMarker[] = existingMarkers ? JSON.parse(existingMarkers) : [];
      
      // Adicionar novo marcador
      markers.push(markerData);
      
      // Salvar de volta no localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(markers));
      
      console.log('Marcador salvo com sucesso:', markerData);
    } catch (error) {
      console.error('Erro ao salvar marcador no localStorage:', error);
    }
  };

  // Função para carregar marcadores do localStorage
  const loadMarkersFromLocalStorage = (): SavedMarker[] => {
    try {
      const savedMarkers = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedMarkers ? JSON.parse(savedMarkers) : [];
    } catch (error) {
      console.error('Erro ao carregar marcadores do localStorage:', error);
      return [];
    }
  };

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

      // Criar ícones personalizados para cada tipo de problema
      const defaultIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      // Ícones personalizados para cada tipo de problema
      // Nota: Em um ambiente real, você usaria imagens hospedadas no seu servidor
      // Aqui estamos apenas alterando a cor do ícone padrão
      const buracoIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: 'buraco-icon' // Aplicaremos CSS para colorir
      });
      
      const alagamentoIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: 'alagamento-icon' // Aplicaremos CSS para colorir
      });
      
      const iluminacaoIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: 'iluminacao-icon' // Aplicaremos CSS para colorir
      });
      
      // Armazenar ícones para uso posterior
      const icons: Record<string, Icon> = {
        [PROBLEM_TYPES.BURACO]: buracoIcon,
        [PROBLEM_TYPES.ALAGAMENTO]: alagamentoIcon,
        [PROBLEM_TYPES.ILUMINACAO]: iluminacaoIcon,
        default: defaultIcon
      };
      
      setCustomIcons(icons);
      
      // Adicionar CSS para colorir os ícones
      const style = document.createElement('style');
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
      
      // Adicionar marcador temporário (será ocultado se houver marcadores salvos)
      const tempMarker = L.marker(defaultLocation, { icon: defaultIcon });
      setCurrentMarker(tempMarker);
      
      // Carregar marcadores salvos do localStorage
      const savedMarkers = loadMarkersFromLocalStorage();
      
      if (savedMarkers.length > 0) {
        // Não adicionar o marcador temporário se temos marcadores salvos
        const markersArray: Marker[] = [];
        
        // Adicionar todos os marcadores salvos ao mapa
        savedMarkers.forEach((marker: SavedMarker) => {
          const icon = icons[marker.type] || icons.default;
          const mapMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(mapInstance);
          
          // Adicionar popup com informações
          const date = new Date(marker.createdAt);
          mapMarker.bindPopup(`
            <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
            Reportado em: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
          `);
          
          markersArray.push(mapMarker);
        });
        
        // Centralizar o mapa no marcador mais recente
        if (savedMarkers.length > 0) {
          const mostRecent = savedMarkers.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
          mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom);
        }
        
        setMarkers(markersArray);
      } else {
        // Adicionar marcador padrão somente se não temos marcadores salvos
        tempMarker.addTo(mapInstance);
        tempMarker.bindPopup("Clique para reportar um problema").openPopup();
      }

      // Permitir clicar no mapa para adicionar/mover o marcador
      mapInstance.on("click", (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        if (currentMarker) {
          // Se já existe um marcador temporário, vamos removê-lo
          mapInstance.removeLayer(currentMarker);
        }
        
        // Criar novo marcador temporário
        const newMarker = L.marker([lat, lng], { icon: defaultIcon }).addTo(mapInstance);
        newMarker.bindPopup("Clique em 'Reportar problema' para identificar o tipo").openPopup();
        setCurrentMarker(newMarker);
      });
      
      // Atualizar estado
      setMap(mapInstance);
      setIsLoading(false);
      
      // Obter localização do usuário se não temos marcadores salvos
      if (savedMarkers.length === 0 && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Atualizar o mapa
            mapInstance.setView([latitude, longitude], defaultZoom);
            
            // Mover o marcador existente
            if (tempMarker) {
              tempMarker.setLatLng([latitude, longitude]);
              tempMarker.bindPopup("Sua localização").openPopup();
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
          
          // Mover o marcador existente se não estiver reportando problema
          if (currentMarker && !selectedProblemType) {
            currentMarker.setLatLng([latitude, longitude]);
            currentMarker.bindPopup("Sua localização").openPopup();
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