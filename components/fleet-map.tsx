"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { VehicleLocation } from "@/lib/redis"

interface FleetMapProps {
  vehicles: VehicleLocation[]
  selectedVehicle: VehicleLocation | null
  onSelectVehicle: (vehicle: VehicleLocation | null) => void
}

// Custom car icon SVG
const createCarIcon = (status: VehicleLocation["status"], heading: number) => {
  const color = status === "active" ? "#22c55e" : status === "idle" ? "#eab308" : "#ef4444"
  
  return L.divIcon({
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2"/>
          <circle cx="12" cy="12" r="6" fill="${color}"/>
          <path d="M12 6L14 12L12 10L10 12L12 6Z" fill="white"/>
        </svg>
      </div>
    `,
    className: "vehicle-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function FleetMap({ vehicles, selectedVehicle, onSelectVehicle }: FleetMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Default center (Tampa, FL)
    const defaultCenter: [number, number] = [27.9506, -82.4572]
    
    mapRef.current = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: false,
    })

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when vehicles change
  useEffect(() => {
    if (!mapRef.current) return

    const currentVehicleIds = new Set(vehicles.map(v => v.id))

    // Remove markers for vehicles that are no longer in the list
    markersRef.current.forEach((marker, id) => {
      if (!currentVehicleIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    // Update or create markers for each vehicle
    vehicles.forEach((vehicle) => {
      const existingMarker = markersRef.current.get(vehicle.id)
      const position: [number, number] = [vehicle.lat, vehicle.lng]

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLatLng(position)
        existingMarker.setIcon(createCarIcon(vehicle.status, vehicle.heading))
      } else {
        // Create new marker
        const marker = L.marker(position, {
          icon: createCarIcon(vehicle.status, vehicle.heading),
        })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 150px;">
              <p style="font-weight: 600; margin: 0 0 4px 0;">${vehicle.name}</p>
              <p style="color: #888; font-size: 12px; margin: 0;">
                Speed: ${(vehicle.speed * 3.6).toFixed(1)} km/h
              </p>
              <p style="color: #888; font-size: 12px; margin: 0;">
                Status: <span style="color: ${
                  vehicle.status === "active" ? "#22c55e" : 
                  vehicle.status === "idle" ? "#eab308" : "#ef4444"
                }">${vehicle.status}</span>
              </p>
            </div>
          `)
          .on("click", () => onSelectVehicle(vehicle))

        markersRef.current.set(vehicle.id, marker)
      }
    })

    // Fit bounds if we have vehicles
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]))
      
      // Only fit bounds if this is the first load or vehicles changed significantly
      if (vehicles.length === 1) {
        mapRef.current.setView([vehicles[0].lat, vehicles[0].lng], 15)
      } else if (markersRef.current.size !== vehicles.length) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [vehicles, onSelectVehicle])

  // Pan to selected vehicle
  useEffect(() => {
    if (!mapRef.current || !selectedVehicle) return
    
    mapRef.current.setView([selectedVehicle.lat, selectedVehicle.lng], 16, {
      animate: true,
      duration: 0.5,
    })

    // Open popup for selected vehicle
    const marker = markersRef.current.get(selectedVehicle.id)
    if (marker) {
      marker.openPopup()
    }
  }, [selectedVehicle])

  return (
    <div ref={containerRef} className="w-full h-full">
      <style jsx global>{`
        .vehicle-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: #1a1a1f;
          color: #fff;
          border-radius: 12px;
          border: 1px solid #27272a;
        }
        .leaflet-popup-tip {
          background: #1a1a1f;
          border: 1px solid #27272a;
        }
        .leaflet-control-zoom a {
          background: #1a1a1f !important;
          color: #fff !important;
          border-color: #27272a !important;
        }
        .leaflet-control-zoom a:hover {
          background: #27272a !important;
        }
      `}</style>
    </div>
  )
}
