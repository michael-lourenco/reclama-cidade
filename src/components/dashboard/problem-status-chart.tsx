"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Marker } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/firebase/FirebaseService"

interface ProblemStatusChartProps {
  markers: Marker[]
}

export function ProblemStatusChart({ markers }: ProblemStatusChartProps) {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    // Contagem de status
    const statusCounts: Record<string, number> = {}

    markers.forEach((marker) => {
      const status = marker.currentStatus || ProblemStatus.REPORTED
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    // Converter para o formato do gráfico
    const data = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }))

    setChartData(data)
  }, [markers])

  // Cores para cada status
  const COLORS = {
    [ProblemStatus.REPORTED]: "#ff8c00",
    [ProblemStatus.UNDER_ANALYSIS]: "#8884d8",
    [ProblemStatus.VERIFIED]: "#82ca9d",
    [ProblemStatus.IN_PROGRESS]: "#ffc658",
    [ProblemStatus.RESOLVED]: "#00C49F",
    [ProblemStatus.CLOSED]: "#0088FE",
    [ProblemStatus.REOPENED]: "#FF8042",
  }

  const getStatusColor = (status: string) => {
    return COLORS[status as keyof typeof COLORS] || "#999999"
  }

  if (chartData.length === 0) {
    return <div className="flex justify-center items-center h-64">Sem dados disponíveis</div>
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} problemas`, "Quantidade"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
