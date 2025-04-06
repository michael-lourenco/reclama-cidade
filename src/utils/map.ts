import { PROBLEM_TYPES } from "@/constants/map-constants"

export const getProblemLabel = (type: string): string => {
  switch (type) {
    case PROBLEM_TYPES.ALERTA:
      return "Alerta"
    case PROBLEM_TYPES.BURACO:
      return "Buraco"
    case PROBLEM_TYPES.CANO_QUEBRADO:
      return "Cano Quebrado"
      // case PROBLEM_TYPES.ALAGAMENTO:
    //   return "Alagamento"
    case PROBLEM_TYPES.ILUMINACAO:
      return "Iluminação"
    case PROBLEM_TYPES.INCENDIO:
      return "Incendio"
    case PROBLEM_TYPES.INCENDIO_CARRO:
      return "Incendio Carro"
    case PROBLEM_TYPES.INCENDIO_CASA:
      return "Incendio Casa"
    case PROBLEM_TYPES.INCENDIO_FLORESTA:
      return "Incendio Floresta"
    case PROBLEM_TYPES.HIDRAULICA:
      return "Hidráulica"
      case PROBLEM_TYPES.BLITZ:
      return "Blitz"
    case PROBLEM_TYPES.PISTA:
      return "Pista"
    case PROBLEM_TYPES.BUEIRO_ABERTO:
      return "Bueiro Aberto"
    case PROBLEM_TYPES.BUEIRO_VAZAMENTO:
      return "bueiro Vazamento"
    case PROBLEM_TYPES.SEMAFARO:
      return "Semafaro"
    default:
      return "Desconhecido"
  }
}

export const formatMarkerDate = (createdAt: Date | { seconds: number } | string | number): Date => {
  if (createdAt instanceof Date) {
    return createdAt
  } else if (createdAt && typeof createdAt === "object" && "seconds" in createdAt) {
    // Handle Firestore Timestamp
    return new Date(createdAt.seconds * 1000)
  } else {
    return new Date(createdAt)
  }
}

interface Marker {
  createdAt: Date | { seconds: number }
}

export const sortMarkersByDate = (markers: Marker[]) => {
  return [...markers].sort((a, b) => {
    const dateA = formatMarkerDate(a.createdAt)
    const dateB = formatMarkerDate(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
}

