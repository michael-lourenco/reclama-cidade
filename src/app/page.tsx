"use client"
import type React from "react"
import { MapFullScreen } from "@/components/map/map-fullscreen"

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <MapFullScreen />
    </div>
  )
}
