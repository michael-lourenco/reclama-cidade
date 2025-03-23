import { PROBLEM_TYPES } from "@/constants/map-constants"

export const getProblemLabel = (type: string): string => {
  switch (type) {
    case PROBLEM_TYPES.BURACO:
      return "Buraco"
    case PROBLEM_TYPES.ALAGAMENTO:
      return "Alagamento"
    case PROBLEM_TYPES.ILUMINACAO:
      return "Iluminação"
    default:
      return "Desconhecido"
  }
}

export const formatMarkerDate = (createdAt: Date | any): Date => {
  if (createdAt instanceof Date) {
    return createdAt
  } else if (createdAt && typeof createdAt === "object" && "seconds" in createdAt) {
    // Handle Firestore Timestamp
    return new Date(createdAt.seconds * 1000)
  } else {
    return new Date(createdAt)
  }
}

export const sortMarkersByDate = (markers: any[]) => {
  return [...markers].sort((a, b) => {
    const dateA = formatMarkerDate(a.createdAt)
    const dateB = formatMarkerDate(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
}

