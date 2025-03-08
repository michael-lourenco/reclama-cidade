"use client";
import MapCard from "@/components/MapCard";

export default function MinhaRota() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mapa de Problemas Urbanos</h1>
      
      <MapCard 
        title="Encontre problemas na sua região"
        defaultLocation={[-23.5902,-48.0338]}
        defaultZoom={13}
        height="h-96"
      />
    </div>
  );
}