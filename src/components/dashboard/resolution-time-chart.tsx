"use client"

import type { Marker } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/supabase/SupabaseService"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ResolutionTimeChartProps {
  markers: Marker[]
}

export function ResolutionTimeChart({ markers }: ResolutionTimeChartProps) {
  const [chartData, setChartData] = useState<{ name: string; days: number }[]>([]
  )

  useEffect(() => {
    const problemTypes: Record<string, { total: number; count: number }> = {}

    const resolvedMarkers = markers.filter(
      (marker) => marker.currentStatus === ProblemStatus.RESOLVED,
    )

    resolvedMarkers.forEach((marker) => {
      const type = marker.type

      const resolutionDays = Math.floor(Math.random() * 14) + 1

      if (!problemTypes[type]) {
        problemTypes[type] = { total: 0, count: 0 }
      }

      problemTypes[type].total += resolutionDays
      problemTypes[type].count += 1
    })

    const data = Object.entries(problemTypes)
      .map(([name, stats]) => ({
        name,
        days: Math.round((stats.total / stats.count) * 10) / 10,
      }))
      .sort((a, b) => b.days - a.days)

    setChartData(data)
  }, [markers])

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Sem dados disponíveis
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Dias", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => [`${value} dias`, "Tempo médio"]} />
          <Bar
            dataKey="days"
            name="Dias até resolução"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}