"use client"

import { useEffect, useRef, useCallback } from "react"
import type { VehicleLocation } from "@/lib/redis"

type LeafletMap = import("leaflet").Map
type LeafletMarker = import("leaflet").Marker
type LeafletModule = typeof import("leaflet")

interface LeafletMapProps {
  vehicles: VehicleLocation[]
}

export function LeafletMapComponent({ vehicles }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map())
  const trailLayersRef = useRef<Map<string, unknown>>(new Map())
  const leafletRef = useRef<LeafletModule | null>(null)

  // Initialize map
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isMounted = true

    const initMap = async () => {
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")
      
      // Check if component is still mounted
      if (!isMounted || !containerRef.current) return
      
      // If map already exists, don't reinitialize
      if (mapRef.current) return
      
      // Check if container already has a map (from HMR or React strict mode)
      if ((container as HTMLElement & { _leaflet_id?: number })._leaflet_id) {
        return
      }

      leafletRef.current = L

      const defaultCenter: [number, number] = [27.9506, -82.4572]
      
      mapRef.current = L.map(container, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapRef.current)

      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current)
    }

    initMap()

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      // Clear markers and trails refs
      markersRef.current.clear()
      trailLayersRef.current.clear()
    }
  }, [])

  // Create vehicle icon
  const createVehicleIcon = useCallback((vehicle: VehicleLocation, L: LeafletModule) => {
    const emoji = vehicle.carEmoji || "🚗"
    const color = vehicle.carColor || "#0ea5e9"
    const statusColor = vehicle.status === "active" ? "#22c55e" : vehicle.status === "idle" ? "#eab308" : "#ef4444"

    return L.divIcon({
      className: "custom-vehicle-marker",
      html: `
        <div style="
          position: relative;
          width: 56px;
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div style="
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, ${color}40, ${color}20);
            border: 3px solid ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 4px 20px ${color}50;
            position: relative;
          ">
            ${emoji}
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 14px;
              height: 14px;
              background: ${statusColor};
              border-radius: 50%;
              border: 2px solid #111113;
            "></div>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 14px solid ${color};
            margin-top: -2px;
          "></div>
        </div>
      `,
      iconSize: [56, 70],
      iconAnchor: [28, 70],
    })
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L = leafletRef.current

    const currentVehicleIds = new Set(vehicles.map(v => v.id))

    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (!currentVehicleIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    trailLayersRef.current.forEach((trail, id) => {
      if (!currentVehicleIds.has(id)) {
        (trail as { remove: () => void }).remove()
        trailLayersRef.current.delete(id)
      }
    })

    vehicles.forEach((vehicle) => {
      const position: [number, number] = [vehicle.lat, vehicle.lng]

      // Update or create trail
      if (vehicle.trail && vehicle.trail.length > 1) {
        const trailCoords: [number, number][] = vehicle.trail.map(p => [p.lat, p.lng])
        const existingTrail = trailLayersRef.current.get(vehicle.id) as { setLatLngs: (coords: [number, number][]) => void } | undefined
        
        if (existingTrail) {
          existingTrail.setLatLngs(trailCoords)
        } else {
          const trailLine = L.polyline(trailCoords, {
            color: vehicle.carColor || '#0ea5e9',
            weight: 3,
            opacity: 0.5,
            dashArray: '10, 10',
          }).addTo(mapRef.current!)
          trailLayersRef.current.set(vehicle.id, trailLine)
        }
      }

      // Update or create marker
      const existingMarker = markersRef.current.get(vehicle.id)
      
      if (existingMarker) {
        existingMarker.setLatLng(position)
        existingMarker.setIcon(createVehicleIcon(vehicle, L))
      } else {
        const marker = L.marker(position, {
          icon: createVehicleIcon(vehicle, L),
        })
        
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 8px; min-width: 150px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${vehicle.name || vehicle.id}</div>
            <div style="color: #888; font-size: 12px;">Status: ${vehicle.status}</div>
            <div style="color: #888; font-size: 12px;">Speed: ${vehicle.speed?.toFixed(1) || 0} mph</div>
          </div>
        `)

        marker.addTo(mapRef.current!)
        markersRef.current.set(vehicle.id, marker)
      }
    })

    // Fit bounds if vehicles exist
    if (vehicles.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng] as [number, number]))
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [vehicles, createVehicleIcon])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}
