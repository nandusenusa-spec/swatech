"use client"

import { ArrowRight, Play, MapPin, MessageCircle, Phone, Navigation } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { VehicleLocation } from "@/lib/redis"

const words = ["Landing Pages", "Business Systems", "Custom Software", "Fleet Tracking"]

// Custom car icon SVG
const createCarIcon = (status: VehicleLocation["status"], heading: number) => {
  const color = status === "active" ? "#22c55e" : status === "idle" ? "#eab308" : "#ef4444"
  
  return L.divIcon({
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="${color}" opacity="0.3"/>
          <circle cx="12" cy="12" r="7" fill="${color}"/>
          <path d="M12 5L15 12L12 9L9 12L12 5Z" fill="white"/>
        </svg>
      </div>
    `,
    className: "vehicle-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Word rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length)
        setIsVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Fetch vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/location")
      const data = await res.json()
      if (data.vehicles) {
        setVehicles(data.vehicles)
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
    const interval = setInterval(fetchVehicles, 2000)
    return () => clearInterval(interval)
  }, [fetchVehicles])

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const defaultCenter: [number, number] = [27.9506, -82.4572]
    
    mapRef.current = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: false,
    })

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapRef.current)

    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return

    const currentVehicleIds = new Set(vehicles.map(v => v.id))

    markersRef.current.forEach((marker, id) => {
      if (!currentVehicleIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    vehicles.forEach((vehicle) => {
      const existingMarker = markersRef.current.get(vehicle.id)
      const position: [number, number] = [vehicle.lat, vehicle.lng]

      const popupContent = `
        <div style="font-family: system-ui; min-width: 180px; padding: 4px;">
          <p style="font-weight: 700; margin: 0 0 8px 0; font-size: 14px; color: #fff;">${vehicle.name}</p>
          <p style="color: #71717a; font-size: 12px; margin: 0 0 4px 0;">
            Speed: ${(vehicle.speed * 3.6).toFixed(1)} km/h
          </p>
          <p style="color: #71717a; font-size: 12px; margin: 0 0 12px 0;">
            Status: <span style="color: ${
              vehicle.status === "active" ? "#22c55e" : 
              vehicle.status === "idle" ? "#eab308" : "#ef4444"
            }; font-weight: 600;">${vehicle.status.toUpperCase()}</span>
          </p>
          ${vehicle.phone ? `
            <a href="https://wa.me/${vehicle.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(vehicle.name)}%2C%20te%20contacto%20desde%20SWATech%20Fleet" 
               target="_blank"
               style="display: flex; align-items: center; gap: 8px; background: #25D366; color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 600;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send WhatsApp
            </a>
          ` : `
            <p style="color: #52525b; font-size: 11px; margin: 0;">No phone registered</p>
          `}
        </div>
      `

      if (existingMarker) {
        existingMarker.setLatLng(position)
        existingMarker.setIcon(createCarIcon(vehicle.status, vehicle.heading))
        existingMarker.setPopupContent(popupContent)
      } else {
        const marker = L.marker(position, {
          icon: createCarIcon(vehicle.status, vehicle.heading),
        })
          .addTo(mapRef.current!)
          .bindPopup(popupContent)
          .on("click", () => setSelectedVehicle(vehicle))

        markersRef.current.set(vehicle.id, marker)
      }
    })

    if (vehicles.length === 1 && !selectedVehicle) {
      mapRef.current.setView([vehicles[0].lat, vehicles[0].lng], 15)
    }
  }, [vehicles, selectedVehicle])

  const activeCount = vehicles.filter(v => v.status === "active").length
  const totalCount = vehicles.length

  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Serving Tampa, FL & Beyond</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl text-balance font-mono">
              We Build{" "}
              <span
                className={`inline-block text-primary transition-all duration-400 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                {words[currentWord]}
              </span>
              <br />
              <span className="text-muted-foreground">For Your Business</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg text-pretty">
              From a simple landing page to real-time fleet tracking systems.
              We adapt every solution to your exact needs.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href="#pricing"
                className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                See Plans & Pricing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-border"
              >
                <Play className="h-4 w-4 text-primary" />
                How It Works
              </a>
            </div>

            {/* Mini Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "50+", label: "Projects" },
                { value: "99%", label: "Uptime" },
                { value: "24/7", label: "Support" },
                { value: "$200", label: "Starting/yr" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground font-mono">{stat.value}</span>
                  <span className="mt-0.5 text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Live Map */}
          <div className="relative flex flex-col gap-4">
            {/* Demo Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-primary">LIVE DEMO</span>
                </div>
                <span className="text-sm text-muted-foreground">Real-time Fleet Tracking</span>
              </div>
              {totalCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3 text-green-500" />
                  <span>{activeCount} of {totalCount} active</span>
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="relative h-[400px] lg:h-[480px] w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/5">
              <div ref={containerRef} className="absolute inset-0" />
              
              {/* Overlay when no vehicles */}
              {vehicles.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm z-10">
                  <MapPin className="h-12 w-12 text-primary/40 mb-4" />
                  <p className="text-sm font-medium text-foreground mb-1">No drivers connected</p>
                  <p className="text-xs text-muted-foreground mb-4">Waiting for real-time location data...</p>
                  <a 
                    href="/driver" 
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <Phone className="h-3 w-3" />
                    Connect Your Phone
                  </a>
                </div>
              )}
              
              {/* Vehicle List Overlay */}
              {vehicles.length > 0 && (
                <div className="absolute top-3 left-3 z-20 max-h-[200px] overflow-y-auto rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-lg">
                  <div className="p-2 space-y-1">
                    {vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          if (mapRef.current) {
                            mapRef.current.setView([vehicle.lat, vehicle.lng], 16, { animate: true })
                            const marker = markersRef.current.get(vehicle.id)
                            if (marker) marker.openPopup()
                          }
                        }}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary ${
                          selectedVehicle?.id === vehicle.id ? "bg-secondary" : ""
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          vehicle.status === "active" ? "bg-green-500" : 
                          vehicle.status === "idle" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{vehicle.name}</p>
                          <p className="text-[10px] text-muted-foreground">{(vehicle.speed * 3.6).toFixed(0)} km/h</p>
                        </div>
                        {vehicle.phone && (
                          <a
                            href={`https://wa.me/${vehicle.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(vehicle.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                          >
                            <MessageCircle className="h-3 w-3" />
                          </a>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Driver link */}
            <p className="text-center text-xs text-muted-foreground">
              Open <a href="/driver" target="_blank" className="text-primary hover:underline font-medium">/driver</a> on your phone to connect
            </p>
          </div>
        </div>
      </div>

      {/* Map Styles */}
      <style jsx global>{`
        .vehicle-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: #111113;
          color: #fff;
          border-radius: 12px;
          border: 1px solid #27272a;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .leaflet-popup-tip {
          background: #111113;
        }
        .leaflet-control-zoom a {
          background: #111113 !important;
          color: #fff !important;
          border-color: #27272a !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1f !important;
        }
        .leaflet-control-attribution {
          background: rgba(17,17,19,0.8) !important;
          color: #52525b !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #71717a !important;
        }
      `}</style>
    </section>
  )
}
