"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Locate } from "lucide-react";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

interface MapCardProps {
  title?: string;
  defaultLocation?: [number, number]; // [latitude, longitude]
  defaultZoom?: number;
  height?: string;
  width?: string;
}

// Componente interno que será carregado apenas no cliente
const MapContent = ({
  defaultLocation,
  defaultZoom,
  height,
  setIsLoading,
}: {
  defaultLocation: [number, number];
  defaultZoom: number;
  height: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

    // Importar dinamicamente o Leaflet
    import("leaflet").then((L) => {
      // Corrigir os ícones
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Se já temos um mapa, não faça nada
      if (map) return;

      // Inicializar o mapa
      console.log("Inicializando mapa Leaflet");
      const mapInstance = L.map(mapRef.current).setView(defaultLocation, defaultZoom);

      // Adicionar o tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Adicionar marcador inicial
      const initialMarker = L.marker(defaultLocation).addTo(mapInstance);
      initialMarker.bindPopup("Localização selecionada").openPopup();

      // Permitir clicar no mapa para adicionar/mover o marcador
      mapInstance.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          const newMarker = L.marker([lat, lng]).addTo(mapInstance);
          newMarker.bindPopup("Localização selecionada").openPopup();
          setMarker(newMarker);
        }
      });
      
      // Atualizar estado
      setMap(mapInstance);
      setMarker(initialMarker);
      setIsLoading(false);
      
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
  }, [mapRef.current]); // Dependência apenas para o ref do mapa

  const handleSearch = async () => {
    if (!searchQuery || !map) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLatLng = [parseFloat(lat), parseFloat(lon)];
        
        // Atualizar o mapa e o marcador
        map.setView(newLatLng, 13);
        
        if (marker) {
          marker.setLatLng(newLatLng);
        } else {
          const L = await import("leaflet");
          const newMarker = L.marker(newLatLng).addTo(map);
          newMarker.bindPopup("Localização pesquisada").openPopup();
          setMarker(newMarker);
        }
      }
    } catch (error) {
      console.error("Erro ao pesquisar localização:", error);
    }
  };

  const getUserLocation = async () => {
    if (!map) return;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Atualizar o mapa e o marcador
          map.setView([latitude, longitude], 15);
          
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            const L = await import("leaflet");
            const newMarker = L.marker([latitude, longitude]).addTo(map);
            newMarker.bindPopup("Sua localização").openPopup();
            setMarker(newMarker);
          }
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  };

  return (
    <>
      <div className="px-4 py-2 bg-card border-t border-b flex items-center gap-2">
        <Input
          type="text"
          placeholder="Pesquisar localização..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleSearch} 
          title="Pesquisar localização"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={getUserLocation} 
          title="Usar minha localização"
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>
      <div ref={mapRef} style={{ height: height.replace('h-', '') === '96' ? '24rem' : height.replace('h-', '') + 'rem' }} className="w-full" />
    </>
  );
};

// Componente principal com carregamento dinâmico
const MapCard: React.FC<MapCardProps> = ({
  title = "Mapa de Localização",
  defaultLocation = [-23.5505, -46.6333], // São Paulo por padrão
  defaultZoom = 13,
  height = "h-96",
  width = "w-full",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className={`${width} overflow-hidden`}>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!isClient ? (
          <div className="px-4 py-2 bg-card border-t border-b flex items-center gap-2">
            <div className="h-9 bg-muted rounded w-full"></div>
            <div className="h-9 w-9 bg-muted rounded"></div>
            <div className="h-9 w-9 bg-muted rounded"></div>
          </div>
        ) : null}
        
        {!isClient || isLoading ? (
          <Skeleton className={height + " w-full"} />
        ) : null}
        
        {isClient && (
          <MapContent 
            defaultLocation={defaultLocation}
            defaultZoom={defaultZoom}
            height={height}
            setIsLoading={setIsLoading}
          />
        )}
        
        <div className="p-3 bg-card text-xs text-muted-foreground border-t">
          Clique no mapa para selecionar uma localização. Use os botões para pesquisar ou usar sua localização atual.
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;