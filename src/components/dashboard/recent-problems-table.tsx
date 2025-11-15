
"use client"

import type { Marker } from "@/components/marker/types/marker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ProblemStatus,
  updateMarkerStatus,
} from "@/services/supabase/SupabaseService"
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface RecentProblemsTableProps {
  markers: Marker[]
}

const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }
  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

export function RecentProblemsTable({ markers }: RecentProblemsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Marker>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredMarkers = markers.filter(
    (marker) =>
      marker.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (marker.currentStatus &&
        marker.currentStatus.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedMarkers = [...filteredMarkers].sort((a, b) => {
    if (sortField === "createdAt") {
      const dateA = convertToDate(a.createdAt)
      const dateB = convertToDate(b.createdAt)

      return sortDirection === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    }

    const valueA = String(a[sortField] || "")
    const valueB = String(b[sortField] || "")

    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA)
  })

  const toggleSort = (field: keyof Marker) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (field: keyof Marker) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  const formatDate = (date: Date | any) => {
    if (!date) return "N/A"

    const d = convertToDate(date)
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case ProblemStatus.REPORTED:
        return "bg-yellow-500"
      case ProblemStatus.UNDER_ANALYSIS:
        return "bg-blue-500"
      case ProblemStatus.VERIFIED:
        return "bg-purple-500"
      case ProblemStatus.IN_PROGRESS:
        return "bg-orange-500"
      case ProblemStatus.RESOLVED:
        return "bg-green-500"
      case ProblemStatus.CLOSED:
        return "bg-gray-500"
      case ProblemStatus.REOPENED:
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const handleStatusUpdate = async (
    markerId: string,
    newStatus: ProblemStatus,
  ) => {
    try {
      const userEmail = "admin@example.com"

      await updateMarkerStatus(
        markerId,
        newStatus,
        `Status atualizado para ${newStatus}`,
        userEmail,
      )

      router.refresh()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar problemas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("type")}
              >
                <div className="flex items-center">
                  Tipo {renderSortIcon("type")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("currentStatus")}
              >
                <div className="flex items-center">
                  Status {renderSortIcon("currentStatus")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center">
                  Data {renderSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead>Reportado por</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMarkers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center"
                >
                  Nenhum problema encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedMarkers.map((marker) => (
                <TableRow key={marker.id}>
                  <TableCell>{marker.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(marker.currentStatus)}>
                      {marker.currentStatus || ProblemStatus.REPORTED}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(marker.createdAt)}</TableCell>
                  <TableCell>{marker.userEmail}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        {marker.currentStatus !==
                          ProblemStatus.UNDER_ANALYSIS && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.UNDER_ANALYSIS,
                              )
                            }
                          >
                            Marcar como Em Análise
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.VERIFIED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.VERIFIED,
                              )
                            }
                          >
                            Marcar como Verificado
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.IN_PROGRESS && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.IN_PROGRESS,
                              )
                            }
                          >
                            Marcar como Em Andamento
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.RESOLVED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.RESOLVED,
                              )
                            }
                          >
                            Marcar como Resolvido
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.CLOSED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.CLOSED,
                              )
                            }
                          >
                            Marcar como Fechado
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
