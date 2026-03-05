"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MapPin, Navigation, Wifi, WifiOff, Car, Package, Clock, Route, MessageCircle } from "lucide-react"

type DeliveryStatus = "none" | "pickup" | "in-transit" | "delivered"

export default function DriverPage() {
  const [driverId] = useState(() => `driver-${Math.random().toString(36).substring(2, 8)}`)
  const [driverName, setDriverName] = useState("")
  const [driverPhone, setDriverPhone] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  
  // New fields
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("none")
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<number | null>(null)
  const [totalMiles, setTotalMiles] = useState(0)
  const [customMessage, setCustomMessage] = useState("")
  const [showMessageBubble, setShowMessageBubble] = useState(true)
  
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null)

  // Calculate distance between two points in miles
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const sendLocation = useCallback(async (position: GeolocationPosition) => {
    if (!driverName) return
    
    // Calculate miles traveled
    let newTotalMiles = totalMiles
    if (lastPositionRef.current) {
      const distance = calculateDistance(
        lastPositionRef.current.lat,
        lastPositionRef.current.lng,
        position.coords.latitude,
        position.coords.longitude
      )
      // Only add if distance is reasonable (less than 1 mile per update to filter GPS jumps)
      if (distance < 1) {
        newTotalMiles = totalMiles + distance
        setTotalMiles(newTotalMiles)
      }
    }
    lastPositionRef.current = { lat: position.coords.latitude, lng: position.coords.longitude }
    
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
          phone: driverPhone || undefined,
          deliveryStatus,
          clockedIn,
          clockInTime,
          totalMiles: newTotalMiles,
          message: showMessageBubble ? (customMessage || "HI, LET'S TALK!") : undefined,
        }),
      })
      
      if (response.ok) {
        setLastUpdate(new Date())
        setError(null)
      }
    } catch {
      setError("Failed to send location")
    }
  }, [driverId, driverName, driverPhone, deliveryStatus, clockedIn, clockInTime, totalMiles, customMessage, showMessageBubble])

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

  const handleClockToggle = () => {
    if (!clockedIn) {
      setClockedIn(true)
      setClockInTime(Date.now())
      setTotalMiles(0)
    } else {
      setClockedIn(false)
      setClockInTime(null)
    }
  }

  const formatDuration = (startTime: number) => {
    const diff = Date.now() - startTime
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const deliveryStatuses: { value: DeliveryStatus; label: string; color: string }[] = [
    { value: "none", label: "No Delivery", color: "bg-muted" },
    { value: "pickup", label: "Pickup", color: "bg-yellow-500" },
    { value: "in-transit", label: "In Transit", color: "bg-blue-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
  ]

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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                WhatsApp Number <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g., +1 813 555 1234"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Dispatchers can contact you directly via WhatsApp
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Message <span className="text-muted-foreground">(shows on map)</span>
              </label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="HI, LET'S TALK!"
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
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
        {/* Clock In/Out + Miles */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleClockToggle}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              clockedIn 
                ? "bg-green-500/10 border-green-500/30 text-green-500" 
                : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium">{clockedIn ? "Clocked In" : "Clock In"}</span>
            {clockedIn && clockInTime && (
              <span className="text-lg font-bold">{formatDuration(clockInTime)}</span>
            )}
          </button>
          
          <div className="p-4 rounded-xl border border-border bg-secondary flex flex-col items-center gap-2">
            <Route className="w-6 h-6 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Miles Today</span>
            <span className="text-lg font-bold text-foreground">{totalMiles.toFixed(1)} mi</span>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Delivery Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {deliveryStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setDeliveryStatus(status.value)}
                className={`p-3 rounded-lg text-xs font-medium transition-all ${
                  deliveryStatus === status.value
                    ? `${status.color} text-white`
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Bubble Toggle */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Show Message Bubble</span>
            </div>
            <button
              onClick={() => setShowMessageBubble(!showMessageBubble)}
              className={`w-12 h-6 rounded-full transition-all ${
                showMessageBubble ? "bg-primary" : "bg-muted"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                showMessageBubble ? "translate-x-6" : "translate-x-0.5"
              }`} />
            </button>
          </div>
          {showMessageBubble && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing: &ldquo;{customMessage || "HI, LET'S TALK!"}&rdquo;
            </p>
          )}
        </div>

        {/* Location Display */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
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
                    ? `${(currentPosition.coords.speed * 2.237).toFixed(1)} mph`
                    : "0 mph"
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

        {/* Control Button */}
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] ${
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
