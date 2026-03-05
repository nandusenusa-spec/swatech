"use client"

import { ArrowRight, Play, MapPin, MessageCircle, Phone, Navigation, Package, Clock, Route, Mail, X, Check } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { VehicleLocation } from "@/lib/redis"

const words = ["Landing Pages", "Business Systems", "Custom Software", "Fleet Tracking"]

const deliveryColors = {
  none: "#71717a",
  pickup: "#eab308",
  "in-transit": "#3b82f6",
  delivered: "#22c55e",
}

const deliveryLabels = {
  none: "No Delivery",
  pickup: "Pickup",
  "in-transit": "In Transit",
  delivered: "Delivered",
}

// Custom car/avatar icon with message bubble
const createVehicleIcon = (vehicle: VehicleLocation) => {
  const color = vehicle.status === "active" ? "#22c55e" : vehicle.status === "idle" ? "#eab308" : "#ef4444"
  const deliveryColor = deliveryColors[vehicle.deliveryStatus || "none"]
  const hasMessage = vehicle.message && vehicle.status !== "offline"
  
  return L.divIcon({
    html: `
      <div style="position: relative; transform: rotate(0deg);">
        ${hasMessage ? `
          <div class="message-bubble" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #0ea5e9;
            color: white;
            padding: 6px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
            animation: bounce 2s ease-in-out infinite;
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
            z-index: 100;
          ">
            ${vehicle.message}
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid #0ea5e9;
            "></div>
          </div>
        ` : ''}
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          border: 3px solid ${deliveryColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${color}66;
          position: relative;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 14px;
            height: 14px;
            background: ${vehicle.clockedIn ? '#22c55e' : '#71717a'};
            border-radius: 50%;
            border: 2px solid #111113;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
              <path d="M12 6v6l4 2" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(${vehicle.heading || 0}deg);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    className: "vehicle-marker",
    iconSize: [48, 80],
    iconAnchor: [24, 48],
  })
}

interface DemoGateProps {
  onUnlock: () => void
}

function DemoGate({ onUnlock }: DemoGateProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Email is required")
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "fleet-demo" }),
      })
      
      if (res.ok) {
        localStorage.setItem("swatech-demo-unlocked", "true")
        onUnlock()
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 backdrop-blur-md z-20 p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Navigation className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Watch the Live Demo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to unlock real-time fleet tracking
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Unlocking..."
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Unlock Live Demo
              </>
            )}
          </button>
        </form>
        
        <p className="mt-4 text-[10px] text-muted-foreground/60 text-center">
          We respect your privacy. No spam, ever.
        </p>
      </div>
    </div>
  )
}

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null)
  const [demoUnlocked, setDemoUnlocked] = useState(false)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if demo was previously unlocked
  useEffect(() => {
    const unlocked = localStorage.getItem("swatech-demo-unlocked")
    if (unlocked === "true") {
      setDemoUnlocked(true)
    }
  }, [])

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
    if (!demoUnlocked) return
    fetchVehicles()
    const interval = setInterval(fetchVehicles, 2000)
    return () => clearInterval(interval)
  }, [fetchVehicles, demoUnlocked])

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !demoUnlocked) return

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
  }, [demoUnlocked])

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
        <div style="font-family: system-ui; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <p style="font-weight: 700; margin: 0; font-size: 14px; color: #fff;">${vehicle.name}</p>
              <p style="color: ${
                vehicle.status === "active" ? "#22c55e" : 
                vehicle.status === "idle" ? "#eab308" : "#ef4444"
              }; font-size: 11px; margin: 0; font-weight: 600;">${vehicle.status.toUpperCase()}</p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #1a1a1f; padding: 8px; border-radius: 8px;">
              <p style="color: #71717a; font-size: 10px; margin: 0;">Speed</p>
              <p style="color: #fff; font-size: 13px; font-weight: 600; margin: 2px 0 0 0;">${(vehicle.speed * 2.237).toFixed(1)} mph</p>
            </div>
            <div style="background: #1a1a1f; padding: 8px; border-radius: 8px;">
              <p style="color: #71717a; font-size: 10px; margin: 0;">Miles Today</p>
              <p style="color: #fff; font-size: 13px; font-weight: 600; margin: 2px 0 0 0;">${(vehicle.totalMiles || 0).toFixed(1)} mi</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <div style="flex: 1; background: ${deliveryColors[vehicle.deliveryStatus || "none"]}22; padding: 6px 10px; border-radius: 6px; border: 1px solid ${deliveryColors[vehicle.deliveryStatus || "none"]}44;">
              <p style="color: ${deliveryColors[vehicle.deliveryStatus || "none"]}; font-size: 11px; font-weight: 600; margin: 0; text-align: center;">
                ${deliveryLabels[vehicle.deliveryStatus || "none"]}
              </p>
            </div>
            <div style="flex: 1; background: ${vehicle.clockedIn ? '#22c55e' : '#71717a'}22; padding: 6px 10px; border-radius: 6px; border: 1px solid ${vehicle.clockedIn ? '#22c55e' : '#71717a'}44;">
              <p style="color: ${vehicle.clockedIn ? '#22c55e' : '#71717a'}; font-size: 11px; font-weight: 600; margin: 0; text-align: center;">
                ${vehicle.clockedIn ? 'Clocked In' : 'Clocked Out'}
              </p>
            </div>
          </div>
          
          ${vehicle.phone ? `
            <a href="https://wa.me/${vehicle.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(vehicle.name)}%2C%20contacting%20you%20from%20SWATech%20Fleet" 
               target="_blank"
               style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: white; padding: 10px 14px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 600;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send WhatsApp
            </a>
          ` : `
            <p style="color: #52525b; font-size: 11px; margin: 0; text-align: center;">No phone registered</p>
          `}
        </div>
      `

      if (existingMarker) {
        existingMarker.setLatLng(position)
        existingMarker.setIcon(createVehicleIcon(vehicle))
        existingMarker.setPopupContent(popupContent)
      } else {
        const marker = L.marker(position, {
          icon: createVehicleIcon(vehicle),
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
              {totalCount > 0 && demoUnlocked && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3 text-green-500" />
                  <span>{activeCount} of {totalCount} active</span>
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="relative h-[400px] lg:h-[480px] w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/5">
              {!demoUnlocked ? (
                <DemoGate onUnlock={() => setDemoUnlocked(true)} />
              ) : (
                <>
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
                    <div className="absolute top-3 left-3 z-20 max-h-[280px] overflow-y-auto rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-lg">
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
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              vehicle.status === "active" ? "bg-green-500" : 
                              vehicle.status === "idle" ? "bg-yellow-500" : "bg-red-500"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{vehicle.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground">{(vehicle.speed * 2.237).toFixed(0)} mph</span>
                                <span className="text-[10px] text-muted-foreground">|</span>
                                <span className="text-[10px] text-muted-foreground">{(vehicle.totalMiles || 0).toFixed(1)} mi</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {vehicle.deliveryStatus && vehicle.deliveryStatus !== "none" && (
                                <Package className="h-3 w-3" style={{ color: deliveryColors[vehicle.deliveryStatus] }} />
                              )}
                              {vehicle.clockedIn && (
                                <Clock className="h-3 w-3 text-green-500" />
                              )}
                              {vehicle.phone && (
                                <a
                                  href={`https://wa.me/${vehicle.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(vehicle.name)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Driver link */}
            {demoUnlocked && (
              <p className="text-center text-xs text-muted-foreground">
                Open <a href="/driver" target="_blank" className="text-primary hover:underline font-medium">/driver</a> on your phone to connect
              </p>
            )}
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
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        .message-bubble {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
