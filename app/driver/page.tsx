"use client"

import { useState, useEffect, useCallback } from "react"
import { MapPin, Navigation, Wifi, WifiOff, Car } from "lucide-react"

export default function DriverPage() {
  const [driverId] = useState(() => `driver-${Math.random().toString(36).substring(2, 8)}`)
  const [driverName, setDriverName] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

  const sendLocation = useCallback(async (position: GeolocationPosition) => {
    if (!driverName) return
    
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: driverId,
          name: driverName,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
        }),
      })
      
      if (response.ok) {
        setLastUpdate(new Date())
        setError(null)
      }
    } catch (err) {
      setError("Failed to send location")
    }
  }, [driverId, driverName])

  useEffect(() => {
    if (!isTracking || !isRegistered) return

    let watchId: number

    const startTracking = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser")
        return
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position)
          sendLocation(position)
        },
        (err) => {
          setError(`Error: ${err.message}`)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      )
    }

    startTracking()

    // Also send location every 3 seconds even if position hasn't changed
    const interval = setInterval(() => {
      if (currentPosition) {
        sendLocation(currentPosition)
      }
    }, 3000)

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
      clearInterval(interval)
    }
  }, [isTracking, isRegistered, sendLocation, currentPosition])

  const handleStart = () => {
    if (!driverName.trim()) {
      setError("Please enter your name")
      return
    }
    setIsRegistered(true)
    setIsTracking(true)
    setError(null)
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SWATech Fleet</h1>
            <p className="text-muted-foreground text-sm">Driver Tracking App</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name / Vehicle ID
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g., John - Truck 01"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Start Tracking
            </button>
            
            <p className="text-xs text-muted-foreground text-center">
              Your location will be shared with the fleet dashboard in real-time
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{driverName}</p>
              <p className="text-xs text-muted-foreground">ID: {driverId}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isTracking ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          }`}>
            {isTracking ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-xs font-medium">
              {isTracking ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Location Display */}
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Position</p>
                {currentPosition ? (
                  <p className="font-mono text-sm text-foreground">
                    {currentPosition.coords.latitude.toFixed(6)}, {currentPosition.coords.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Acquiring GPS...</p>
                )}
              </div>
            </div>

            {currentPosition && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-lg font-semibold text-foreground">
                    {currentPosition.coords.speed 
                      ? `${(currentPosition.coords.speed * 3.6).toFixed(1)} km/h`
                      : "0 km/h"
                    }
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Heading</p>
                  <div className="flex items-center gap-2">
                    <Navigation 
                      className="w-4 h-4 text-primary" 
                      style={{ transform: `rotate(${currentPosition.coords.heading || 0}deg)` }}
                    />
                    <p className="text-lg font-semibold text-foreground">
                      {currentPosition.coords.heading?.toFixed(0) || "0"}°
                    </p>
                  </div>
                </div>
              </div>
            )}

            {lastUpdate && (
              <p className="text-xs text-muted-foreground text-center">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Animation */}
        <div className="relative">
          <div className={`w-32 h-32 rounded-full border-4 ${
            isTracking ? "border-primary" : "border-muted"
          } flex items-center justify-center`}>
            <div className={`w-24 h-24 rounded-full ${
              isTracking ? "bg-primary/20" : "bg-muted/20"
            } flex items-center justify-center`}>
              <div className={`w-16 h-16 rounded-full ${
                isTracking ? "bg-primary/40 animate-pulse" : "bg-muted/40"
              } flex items-center justify-center`}>
                <div className={`w-8 h-8 rounded-full ${
                  isTracking ? "bg-primary" : "bg-muted"
                }`} />
              </div>
            </div>
          </div>
          {isTracking && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          )}
        </div>

        {/* Control Button */}
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full max-w-sm py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] ${
            isTracking 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {isTracking ? "Stop Tracking" : "Resume Tracking"}
        </button>
      </div>
    </div>
  )
}
