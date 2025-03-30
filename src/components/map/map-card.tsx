"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Locate, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Map, Marker } from "leaflet";

interface MapCardProps {
  title?: string;
  defaultLocation?: [number, number]; // [latitude, longitude]
  defaultZoom?: number;
  height?: string;
  width?: string;
}

interface MapContentProps {
  defaultLocation: [number, number];
  defaultZoom: number;
  height: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapContent = ({
  defaultLocation,
  defaultZoom,
  height,
  setIsLoading,
}: MapContentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [marker, setMarker] = useState<Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      const L = await import("leaflet");

      configureLeafletIcons(L);

      if (map) return;

      const mapInstance = createMapInstance(
        L,
        mapRef.current,
        defaultLocation,
        defaultZoom
      );
      const initialMarker = addMarkerToMap(
        L,
        mapInstance,
        defaultLocation,
        "Localização selecionada"
      );

      setupMapClickHandler(L, mapInstance, marker, setMarker);

      setMap(mapInstance);
      setMarker(initialMarker);
      setIsLoading(false);

      refreshMapSize(mapInstance);
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef.current]);

  const configureLeafletIcons = (L: typeof import("leaflet")) => {
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  };

  const createMapInstance = (
    L: typeof import("leaflet"),
    container: HTMLDivElement,
    center: [number, number],
    zoom: number
  ) => {
    const mapInstance = L.map(container).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    return mapInstance;
  };

  const addMarkerToMap = (
    L: typeof import("leaflet"),
    mapInstance: Map,
    position: [number, number],
    popupText: string
  ) => {
    const marker = L.marker(position).addTo(mapInstance);
    marker.bindPopup(popupText).openPopup();
    return marker;
  };

  const setupMapClickHandler = (
    L: typeof import("leaflet"),
    mapInstance: Map,
    currentMarker: Marker | null,
    setMarker: React.Dispatch<React.SetStateAction<Marker | null>>
  ) => {
    mapInstance.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      const position: [number, number] = [lat, lng];

      if (currentMarker) {
        currentMarker.setLatLng(position);
      } else {
        const newMarker = addMarkerToMap(
          L,
          mapInstance,
          position,
          "Localização selecionada"
        );
        setMarker(newMarker);
      }
    });
  };

  const refreshMapSize = (mapInstance: Map) => {
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 100);
  };

  const handleSearch = async () => {
    if (!searchQuery || !map) return;

    try {
      const { latitude, longitude } = await searchLocation(searchQuery);
      updateMapView(map, [latitude, longitude], 13);
      await updateOrCreateMarker(
        [latitude, longitude],
        "Localização pesquisada"
      );
    } catch (error) {
      console.error("Erro ao pesquisar localização:", error);
    }
  };

  const searchLocation = async (query: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Localização não encontrada");
    }

    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  };

  const getUserLocation = async () => {
    if (!map) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          updateMapView(map, [latitude, longitude], 15);
          await updateOrCreateMarker([latitude, longitude], "Sua localização");
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  };

  const updateMapView = (
    mapInstance: Map,
    position: [number, number],
    zoom: number
  ) => {
    mapInstance.setView(position, zoom);
  };

  const updateOrCreateMarker = async (
    position: [number, number],
    popupText: string
  ) => {
    if (marker) {
      marker.setLatLng(position);
    } else {
      const L = await import("leaflet");
      const newMarker = addMarkerToMap(L, map!, position, popupText);
      setMarker(newMarker);
    }
  };

  const convertHeightToPixels = (heightClass: string) => {
    const value = heightClass.replace("h-", "");
    return value === "96" ? "24rem" : `${value}rem`;
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
      <div
        ref={mapRef}
        style={{
          height: convertHeightToPixels(height),
        }}
        className="w-full"
      />
    </>
  );
};

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

  const renderLoadingPlaceholder = () => (
    <div className="px-4 py-2 bg-card border-t border-b flex items-center gap-2">
      <div className="h-9 bg-muted rounded w-full"></div>
      <div className="h-9 w-9 bg-muted rounded"></div>
      <div className="h-9 w-9 bg-muted rounded"></div>
    </div>
  );

  return (
    <Card className={`${width} overflow-hidden`}>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!isClient && renderLoadingPlaceholder()}

        {(!isClient || isLoading) && (
          <Skeleton className={`${height} w-full`} />
        )}

        {isClient && (
          <MapContent
            defaultLocation={defaultLocation}
            defaultZoom={defaultZoom}
            height={height}
            setIsLoading={setIsLoading}
          />
        )}

        <div className="p-3 bg-card text-xs text-muted-foreground border-t">
          Clique no mapa para selecionar uma localização. Use os botões para
          pesquisar ou usar sua localização atual.
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;
