"use client"

import dynamic from "next/dynamic"
import type { VehicleLocation } from "@/lib/redis"

// Load LeafletMap only on client side - this completely avoids SSR issues
const LeafletMap = dynamic(
  () => import("./leaflet-map").then(mod => mod.LeafletMapComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-card">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface DynamicMapProps {
  vehicles: VehicleLocation[]
}

export function DynamicMap({ vehicles }: DynamicMapProps) {
  return <LeafletMap vehicles={vehicles} />
}
