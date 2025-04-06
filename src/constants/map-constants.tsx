// src/constants/map-constants.ts
export const PROBLEM_TYPES = {
  BURACO: "buraco",
  ALERTA: "alerta",
  CANO_QUEBRADO: "cano-quebrado",
  // ALAGAMENTO: "alagamento", // Comentado como estava no seu código original
  ILUMINACAO: "iluminacao",
  INCENDIO: "incendio",
  INCENDIO_CARRO: "incendio-carro",
  INCENDIO_CASA: "incendio-casa",
  INCENDIO_FLORESTA: "incendio-floresta",
  HIDRAULICA: "hidraulica",
  BLITZ: "blitz",
  PISTA: "pista",
  BUEIRO_ABERTO: "bueiro-aberto",
  BUEIRO_VAZAMENTO: "bueiro-vazamento",
  SEMAFARO: "semafaro",
} as const;

export type ProblemType = typeof PROBLEM_TYPES[keyof typeof PROBLEM_TYPES];

export const LEAFLET_ICON_URLS = {
ICON: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
ICON_RETINA: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
SHADOW: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
};

export const DEFAULT_LOCATION: [number, number] = [-23.5902, -48.0338];
export const DEFAULT_ZOOM = 16;
export const LOCAL_STORAGE_KEY = "mapProblems";

