"use client"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Search, Locate, Menu, AlertTriangle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { LeafletMouseEvent } from "leaflet"
import { MapFullScreen } from "@/components/map/map-fullscreen"

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <MapFullScreen />
    </div>
  )
}
