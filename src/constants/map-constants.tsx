// Define tipos para os problemas
const PROBLEM_TYPES = {
    BURACO: "buraco",
    ALAGAMENTO: "alagamento",
    ILUMINACAO: "iluminacao",
    BLITZ:"blitz",
    PISTA:"pista",
    BUEIRO_ABERTO:"bueiro-aberto",
    BUEIRO_VAZAMENTO:"bueiro-vazamento",
    SEMAFARO:"semafaro",
} as const

const LOCAL_STORAGE_KEY = "mapProblems"

const DEFAULT_LOCATION: [number, number] = [-23.5902, -48.0338]
const DEFAULT_ZOOM = 15

const LEAFLET_ICON_URLS = {
  ICON: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  ICON_RETINA: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  SHADOW: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
}

export {
    DEFAULT_LOCATION,
    DEFAULT_ZOOM,
    LEAFLET_ICON_URLS,
    LOCAL_STORAGE_KEY,
    PROBLEM_TYPES
}
