import { prisma } from "@/lib/prisma"
import { Marker, ProblemStatus, StatusChange } from "@prisma/client"

export async function getMarkers(): Promise<Marker[]> {
  return prisma.marker.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getMarkerById(id: string): Promise<Marker | null> {
  return prisma.marker.findUnique({ where: { id } })
}

export async function createMarker(data: Omit<Marker, "id" | "createdAt">): Promise<Marker> {
  return prisma.marker.create({ data })
}

export async function updateMarker(id: string, data: Partial<Marker>): Promise<Marker> {
  return prisma.marker.update({ where: { id }, data })
}

export async function deleteMarker(id: string): Promise<Marker> {
  return prisma.marker.delete({ where: { id } })
}

export async function getUserMarkers(userEmail: string): Promise<Marker[]> {
  return prisma.marker.findMany({ where: { userEmail }, orderBy: { createdAt: "desc" } })
}

export async function addStatusChange(markerId: string, status: ProblemStatus, comment: string | undefined, updatedBy: string): Promise<StatusChange> {
  return prisma.statusChange.create({
    data: {
      markerId,
      status,
      comment,
      updatedBy,
    },
  })
}

export async function getMarkerStatusHistory(markerId: string): Promise<StatusChange[]> {
  return prisma.statusChange.findMany({
    where: { markerId },
    orderBy: { timestamp: "desc" },
  })
}
