"use client"

import type { Marker } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/firebase/FirebaseService"
import { useEffect, useState } from "react"
import { ResponsiveContainer, Sankey, Tooltip } from "recharts"

interface StatusTransitionChartProps {
  markers: Marker[]
}

interface SankeyNode {
  name: string
}

interface SankeyLink {
  source: number
  target: number
  value: number
}

export function StatusTransitionChart({ markers }: StatusTransitionChartProps) {
  const [data, setData] = useState<{
    nodes: SankeyNode[]
    links: SankeyLink[]
  }>({
    nodes: [],
    links: [],
  })

  useEffect(() => {
    // Definir os nós (status possíveis)
    const statusNodes = [
      { name: ProblemStatus.REPORTED },
      { name: ProblemStatus.UNDER_ANALYSIS },
      { name: ProblemStatus.VERIFIED },
      { name: ProblemStatus.IN_PROGRESS },
      { name: ProblemStatus.RESOLVED },
      { name: ProblemStatus.CLOSED },
      { name: ProblemStatus.REOPENED },
    ]

    // Simular transições de status com base nos dados disponíveis
    // Em um cenário real, você precisaria de dados de histórico de status
    const links: SankeyLink[] = [
      // Reportado -> Em Análise
      {
        source: 0,
        target: 1,
        value:
          markers.filter(
            (m) => m.currentStatus === ProblemStatus.UNDER_ANALYSIS,
          ).length || 5,
      },
      // Em Análise -> Verificado
      {
        source: 1,
        target: 2,
        value:
          markers.filter((m) => m.currentStatus === ProblemStatus.VERIFIED)
            .length || 4,
      },
      // Verificado -> Em Andamento
      {
        source: 2,
        target: 3,
        value:
          markers.filter((m) => m.currentStatus === ProblemStatus.IN_PROGRESS)
            .length || 3,
      },
      // Em Andamento -> Resolvido
      {
        source: 3,
        target: 4,
        value:
          markers.filter((m) => m.currentStatus === ProblemStatus.RESOLVED)
            .length || 2,
      },
      // Resolvido -> Fechado
      {
        source: 4,
        target: 5,
        value:
          markers.filter((m) => m.currentStatus === ProblemStatus.CLOSED)
            .length || 1,
      },
      // Fechado -> Reaberto
      {
        source: 5,
        target: 6,
        value:
          markers.filter((m) => m.currentStatus === ProblemStatus.REOPENED)
            .length || 1,
      },
      // Reaberto -> Em Análise
      {
        source: 6,
        target: 1,
        value: 1,
      },
    ]

    setData({ nodes: statusNodes, links })
  }, [markers])

  if (data.nodes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Carregando dados...
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <Sankey
          data={data}
          nodePadding={50}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          link={{ stroke: "#d9d9d9" }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </div>
  )
}
