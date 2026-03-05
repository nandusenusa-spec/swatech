"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { RefreshCw, Car, MapPin, Clock, Activity, Users, QrCode } from "lucide-react"
import type { VehicleLocation } from "@/lib/redis"

// Dynamic import for Leaflet (client-side only)
const FleetMap = dynamic(() => import("@/components/fleet-map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/50 animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  )
})

export default function FleetDashboard() {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [showQR, setShowQR] = useState(false)

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/location")
      const data = await response.json()
      setVehicles(data.vehicles || [])
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
    const interval = setInterval(fetchVehicles, 2000) // Refresh every 2 seconds
    return () => clearInterval(interval)
  }, [])

  const activeVehicles = vehicles.filter(v => v.status === "active")
  const idleVehicles = vehicles.filter(v => v.status === "idle")
  const offlineVehicles = vehicles.filter(v => v.status === "offline")

  const driverAppUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/driver` 
    : "/driver"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground font-mono">SW</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  SWA<span className="text-primary">Tech</span> Fleet
                </h1>
                <p className="text-xs text-muted-foreground">Real-Time Tracking Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Add Driver</span>
              </button>
              <button
                onClick={fetchVehicles}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground text-center">Add a Driver</h2>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code or share the link with your driver to start tracking
            </p>
            <div className="bg-white p-4 rounded-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(driverAppUrl)}`}
                alt="Driver App QR Code"
                className="w-full aspect-square"
              />
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Or share this link:</p>
              <p className="text-sm text-foreground font-mono break-all">{driverAppUrl}</p>
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1800px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Total Vehicles</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeVehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{idleVehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Idle</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{offlineVehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Offline</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden h-[500px] lg:h-[600px]">
            <FleetMap 
              vehicles={vehicles} 
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
            />
          </div>

          {/* Vehicle List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Vehicles</h2>
              <p className="text-xs text-muted-foreground">
                Updated {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <div className="max-h-[500px] lg:max-h-[536px] overflow-y-auto">
              {vehicles.length === 0 ? (
                <div className="p-8 text-center">
                  <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No vehicles online</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Open the Driver App to start tracking
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${
                        selectedVehicle?.id === vehicle.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          vehicle.status === "active" 
                            ? "bg-green-500/10" 
                            : vehicle.status === "idle"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                        }`}>
                          <Car className={`w-4 h-4 ${
                            vehicle.status === "active" 
                              ? "text-green-500" 
                              : vehicle.status === "idle"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {vehicle.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.status === "active" && `${(vehicle.speed * 3.6).toFixed(1)} km/h`}
                            {vehicle.status === "idle" && "Stopped"}
                            {vehicle.status === "offline" && "Offline"}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          vehicle.status === "active" 
                            ? "bg-green-500 animate-pulse" 
                            : vehicle.status === "idle"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
