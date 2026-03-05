"use client"

import { ArrowRight, Play, Navigation, Mail, Sparkles, Send } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import type { VehicleLocation } from "@/lib/redis"

// Leaflet types for TypeScript
type LeafletMap = import("leaflet").Map
type LeafletMarker = import("leaflet").Marker

interface HeroProps {
  onAccessGranted?: (email: string) => void
  hasAccess?: boolean
}

const words = ["Landing Pages", "Business Systems", "Custom Software", "Fleet Tracking"]

const deliveryColors = {
  none: "#71717a",
  pickup: "#eab308",
  "in-transit": "#3b82f6",
  delivered: "#22c55e",
}

// CSS Animations injected into head
const injectStyles = () => {
  if (typeof document === 'undefined') return
  if (document.getElementById('fleet-animations')) return
  
  const style = document.createElement('style')
  style.id = 'fleet-animations'
  style.textContent = `
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes bounce-message {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-8px); }
    }
    @keyframes flame {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50% { transform: scaleY(1.2) scaleX(0.9); }
    }
    @keyframes float-emoji {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-60px) scale(1.5); }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
    }
    @keyframes car-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .pulse-ring {
      animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }
    .bounce-message {
      animation: bounce-message 2s ease-in-out infinite;
    }
    .flame-effect {
      animation: flame 0.3s ease-in-out infinite;
    }
    .float-emoji {
      animation: float-emoji 2s ease-out forwards;
    }
    .confetti-piece {
      animation: confetti 1s ease-out forwards;
    }
    .car-bounce {
      animation: car-bounce 1s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

// Create animated vehicle icon with all effects
const createVehicleIcon = (vehicle: VehicleLocation, L: typeof import("leaflet")) => {
  const statusColor = vehicle.status === "active" ? "#22c55e" : vehicle.status === "idle" ? "#eab308" : "#ef4444"
  const deliveryColor = deliveryColors[vehicle.deliveryStatus || "none"]
  const carColor = vehicle.carColor || "#0ea5e9"
  const hasMessage = vehicle.message && vehicle.status !== "offline"
  const isMoving = vehicle.status === "active" && vehicle.speed > 5
  const isDelivered = vehicle.deliveryStatus === "delivered"
  const hasFloatingEmoji = vehicle.floatingEmoji
  
  // Get avatar display - always show car emoji by default
  let avatarContent = "🚗" // Default car emoji
  if (vehicle.avatarType === "emoji" && vehicle.avatar) {
    avatarContent = vehicle.avatar
  } else if (vehicle.carBrand) {
    // Show brand-specific vehicle emoji
    const brandEmojis: Record<string, string> = {
      "Toyota": "🚙",
      "Ford": "🚙",
      "Honda": "🚗",
      "Tesla": "🚘",
      "Chevrolet": "🚙",
      "Van": "🚐",
      "Truck": "🛻",
      "Motorcycle": "🏍️",
      "Bike": "🚲",
      "SUV": "🚙",
    }
    avatarContent = brandEmojis[vehicle.carBrand] || "🚗"
  }

  return L.divIcon({
    html: `
      <div style="position: relative;">
        <!-- Radar Pulse Effect -->
        <div class="pulse-ring" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          margin: -30px 0 0 -30px;
          border-radius: 50%;
          border: 2px solid ${carColor};
          pointer-events: none;
        "></div>
        
        <!-- Floating Emoji -->
        ${hasFloatingEmoji ? `
          <div class="float-emoji" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 28px;
            z-index: 110;
            text-shadow: 0 2px 8px rgba(0,0,0,0.5);
          ">${vehicle.floatingEmoji}</div>
        ` : ''}
        
        <!-- Confetti for Delivered -->
        ${isDelivered ? `
          <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); pointer-events: none;">
            ${['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7'].map((c, i) => `
              <div class="confetti-piece" style="
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${c};
                border-radius: 2px;
                left: ${(i - 2) * 12}px;
                animation-delay: ${i * 0.1}s;
              "></div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Message Bubble -->
        ${hasMessage ? `
          <div class="bounce-message" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${carColor} 0%, ${carColor}dd 100%);
            color: white;
            padding: 8px 14px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 20px ${carColor}66;
            z-index: 100;
            margin-bottom: 8px;
          ">
            ${vehicle.message}
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid ${carColor};
            "></div>
          </div>
        ` : ''}
        
        <!-- Main Vehicle Container -->
        <div class="${isMoving ? 'car-bounce' : ''}" style="position: relative;">
          <!-- Speed Flames -->
          ${isMoving && vehicle.speed > 10 ? `
            <div class="flame-effect" style="
              position: absolute;
              left: -12px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 20px;
              opacity: ${Math.min(vehicle.speed / 30, 1)};
            ">🔥</div>
          ` : ''}
          
          <!-- Vehicle Circle -->
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${carColor} 0%, ${carColor}cc 100%);
            border: 4px solid ${deliveryColor};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px ${carColor}66, 0 0 0 4px ${statusColor}44;
            position: relative;
            font-size: ${vehicle.avatarType === 'emoji' ? '28px' : '20px'};
            color: white;
            font-weight: bold;
          ">
            ${avatarContent}
            
            <!-- Status Indicator (top right) -->
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 14px;
              height: 14px;
              background: ${statusColor};
              border-radius: 50%;
              border: 2px solid #111113;
              ${vehicle.status === 'active' ? 'animation: pulse 2s infinite;' : ''}
            "></div>
            
            <!-- Clock Badge (bottom left, only show if not showing status) -->
            ${vehicle.clockedIn ? `
              <div style="
                position: absolute;
                bottom: -2px;
                left: -2px;
                width: 14px;
                height: 14px;
                background: #22c55e;
                border-radius: 50%;
                border: 2px solid #111113;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
              ">✓</div>
            ` : ''}
          </div>
          
          <!-- Direction Arrow -->
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%) rotate(${vehicle.heading || 0}deg);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid ${carColor};
          "></div>
        </div>
        
        <!-- Trail dots indicator -->
        ${vehicle.trail && vehicle.trail.length > 3 ? `
          <div style="
            position: absolute;
            bottom: -16px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 3px;
          ">
            <div style="width: 4px; height: 4px; border-radius: 50%; background: ${carColor}88;"></div>
            <div style="width: 4px; height: 4px; border-radius: 50%; background: ${carColor}66;"></div>
            <div style="width: 4px; height: 4px; border-radius: 50%; background: ${carColor}44;"></div>
          </div>
        ` : ''}
      </div>
    `,
    className: "vehicle-marker",
    iconSize: [56, 100],
    iconAnchor: [28, 56],
  })
}

// Floating Lead Capture Form with Email Verification
function LeadCaptureForm({ onSubmit }: { onSubmit: (email: string, name: string) => void }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"email" | "verify" | "success">("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [demoCode, setDemoCode] = useState("") // For demo display only

  // Step 1: Request verification code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "request" }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.alreadyActive) {
          setError("This email already has an active demo. Only one session per email allowed.")
        } else {
          setError(data.error || "Failed to send code")
        }
        return
      }

      // Also save lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "fleet-demo" }),
      })

      // For demo purposes, show the code
      if (data.demoCode) {
        setDemoCode(data.demoCode)
      }
      
      setStep("verify")
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, action: "verify" }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Invalid code")
        return
      }

      // Save session info
      localStorage.setItem("swatech-demo-session", JSON.stringify({ 
        email, 
        sessionId: data.sessionId,
        expiresAt: data.expiresAt 
      }))
      
      setStep("success")
      onSubmit(email, name)
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-green-500 text-sm">Verified!</p>
            <p className="text-[10px] md:text-xs text-green-500/70">24h access - Open /driver</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === "verify") {
    return (
      <form onSubmit={handleVerifyCode} className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm space-y-2 md:space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-medium text-foreground">Enter verification code</p>
        </div>
        <p className="text-[10px] text-muted-foreground">
          We sent a 6-digit code to {email}
        </p>
        {demoCode && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 text-center">
            <p className="text-[10px] text-primary/70">Demo code:</p>
            <p className="text-lg font-mono font-bold text-primary">{demoCode}</p>
          </div>
        )}
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm text-center font-mono tracking-widest"
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting || verificationCode.length !== 6}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs md:text-sm transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
        <button
          type="button"
          onClick={() => { setStep("email"); setError(""); setDemoCode("") }}
          className="w-full text-[10px] text-muted-foreground hover:text-foreground"
        >
          Use different email
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequestCode} className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm space-y-2 md:space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] md:text-xs font-medium text-foreground">Try the live demo</p>
        </div>
        <span className="text-[8px] md:text-[10px] text-muted-foreground bg-secondary px-1.5 md:px-2 py-0.5 rounded-full">24h access</span>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs md:text-sm"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-secondary/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs md:text-sm"
      />
      {error && <p className="text-[10px] text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs md:text-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Get Verification Code
          </>
        )}
      </button>
      <p className="text-[8px] md:text-[10px] text-muted-foreground/60 text-center">
        One session per email. We verify to prevent abuse.
      </p>
    </form>
  )
}

export function Hero({ onAccessGranted, hasAccess }: HeroProps = {}) {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [hasSubmittedLead, setHasSubmittedLead] = useState(hasAccess || false)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map())
  const trailLayersRef = useRef<Map<string, unknown>>(new Map())
  const leafletRef = useRef<typeof import("leaflet") | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Inject CSS animations
  useEffect(() => {
    injectStyles()
  }, [])

  // Sync with parent access state
  useEffect(() => {
    if (hasAccess !== undefined) {
      setHasSubmittedLead(hasAccess)
    }
  }, [hasAccess])

  // Check if already submitted (with 24h expiration)
  useEffect(() => {
    if (hasAccess !== undefined) return // Skip if controlled by parent
    
    const savedData = localStorage.getItem("swatech-demo-lead")
    if (savedData) {
      try {
        const { timestamp } = JSON.parse(savedData)
        const now = Date.now()
        const hours24 = 24 * 60 * 60 * 1000
        if (now - timestamp < hours24) {
          setHasSubmittedLead(true)
        } else {
          // Expired, clear it
          localStorage.removeItem("swatech-demo-lead")
        }
      } catch {
        // Old format without timestamp, clear it
        localStorage.removeItem("swatech-demo-lead")
      }
    }
  }, [hasAccess])

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

  // Initialize map with dynamic Leaflet import
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const initMap = async () => {
      // Dynamically import Leaflet (client-side only)
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")
      leafletRef.current = L

      const defaultCenter: [number, number] = [27.9506, -82.4572] // Tampa
      
      mapRef.current = L.map(containerRef.current!, {
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
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers and trails
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return
    const L = leafletRef.current

    const currentVehicleIds = new Set(vehicles.map(v => v.id))

    // Remove old markers and trails
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

      // Create popup content
      const milesProgress = vehicle.totalMiles && vehicle.dailyMilesGoal 
        ? Math.min((vehicle.totalMiles / vehicle.dailyMilesGoal) * 100, 100) 
        : 0

      const popupContent = `
        <div style="font-family: system-ui; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <div style="
              width: 44px; 
              height: 44px; 
              border-radius: 12px; 
              background: linear-gradient(135deg, ${vehicle.carColor || '#0ea5e9'} 0%, ${vehicle.carColor || '#0ea5e9'}cc 100%);
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: ${vehicle.avatarType === 'emoji' ? '24px' : '18px'};
              color: white;
              font-weight: bold;
            ">
              ${vehicle.avatarType === 'emoji' && vehicle.avatar ? vehicle.avatar : (vehicle.name?.charAt(0).toUpperCase() || '?')}
            </div>
            <div>
              <p style="font-weight: 700; margin: 0; font-size: 15px; color: #111;">${vehicle.name}</p>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${vehicle.status === "active" ? "#22c55e" : vehicle.status === "idle" ? "#eab308" : "#ef4444"};
                "></span>
                <span style="color: #52525b; font-size: 11px; text-transform: uppercase; font-weight: 600;">
                  ${vehicle.status === "idle" ? "PARKED" : vehicle.status === "active" ? "MOVING" : "OFFLINE"}
                </span>
                ${vehicle.streak && vehicle.streak > 0 ? `<span style="color: #f97316; font-size: 11px;">🔥 ${vehicle.streak}</span>` : ''}
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #1a1a1f; padding: 10px; border-radius: 10px;">
              <p style="color: #71717a; font-size: 10px; margin: 0; text-transform: uppercase;">Speed</p>
              <p style="color: #111; font-size: 18px; font-weight: 700; margin: 2px 0 0 0;">
                ${(vehicle.speed * 2.237).toFixed(0)} 
                <span style="font-size: 10px; color: #71717a; font-weight: 400;">mph</span>
                ${vehicle.speed * 2.237 > 30 ? ' 🔥' : ''}
              </p>
            </div>
            <div style="background: #1a1a1f; padding: 10px; border-radius: 10px;">
              <p style="color: #71717a; font-size: 10px; margin: 0; text-transform: uppercase;">Miles Today</p>
              <p style="color: #111; font-size: 18px; font-weight: 700; margin: 2px 0 0 0;">
                ${(vehicle.totalMiles || 0).toFixed(1)}
              </p>
              <div style="height: 3px; background: #27272a; border-radius: 2px; margin-top: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${milesProgress}%; background: ${vehicle.carColor || '#0ea5e9'};"></div>
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: 6px; margin-bottom: 12px;">
            <div style="flex: 1; background: ${deliveryColors[vehicle.deliveryStatus || "none"]}22; padding: 8px; border-radius: 8px; border: 1px solid ${deliveryColors[vehicle.deliveryStatus || "none"]}44; text-align: center;">
              <p style="color: ${deliveryColors[vehicle.deliveryStatus || "none"]}; font-size: 11px; font-weight: 600; margin: 0;">
                ${vehicle.deliveryStatus === 'delivered' ? '✅ Delivered' : vehicle.deliveryStatus === 'in-transit' ? '🚚 In Transit' : vehicle.deliveryStatus === 'pickup' ? '📥 Pickup' : '📭 No Delivery'}
              </p>
            </div>
            <div style="flex: 1; background: ${vehicle.clockedIn ? '#22c55e' : '#71717a'}22; padding: 8px; border-radius: 8px; border: 1px solid ${vehicle.clockedIn ? '#22c55e' : '#71717a'}44; text-align: center;">
              <p style="color: ${vehicle.clockedIn ? '#22c55e' : '#71717a'}; font-size: 11px; font-weight: 600; margin: 0;">
                ${vehicle.clockedIn ? '✓ Clocked In' : 'Clocked Out'}
              </p>
            </div>
          </div>
          
          ${vehicle.achievements && vehicle.achievements.length > 0 ? `
            <div style="display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap;">
              ${vehicle.achievements.slice(0, 4).map(a => `
                <span style="background: #eab30822; padding: 4px 8px; border-radius: 6px; font-size: 12px;">
                  ${a === 'first_mile' ? '🏃' : a === 'speed_demon' ? '🏎️' : a === 'marathon' ? '🏅' : a === 'streak_3' ? '🔥' : '⭐'}
                </span>
              `).join('')}
            </div>
          ` : ''}
          
          ${vehicle.phone ? `
            <a href="https://wa.me/${vehicle.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(vehicle.name)}!" 
               target="_blank"
               style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: white; padding: 12px 16px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.2s;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send WhatsApp
            </a>
          ` : `
            <p style="color: #52525b; font-size: 11px; margin: 0; text-align: center;">No phone registered</p>
          `}
        </div>
      `

      // Update or create marker
      const existingMarker = markersRef.current.get(vehicle.id)
      if (existingMarker) {
        existingMarker.setLatLng(position)
        existingMarker.setIcon(createVehicleIcon(vehicle, L))
        existingMarker.setPopupContent(popupContent)
      } else {
        const marker = L.marker(position, {
          icon: createVehicleIcon(vehicle, L),
        })
          .addTo(mapRef.current!)
          .bindPopup(popupContent)

        markersRef.current.set(vehicle.id, marker)
      }
    })

    // Center on first vehicle if only one
    if (vehicles.length === 1) {
      mapRef.current.setView([vehicles[0].lat, vehicles[0].lng], 14)
    }
  }, [vehicles])

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
            <div className="mt-6 md:mt-10 grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-4">
              {[
                { value: "50+", label: "Projects" },
                { value: "99%", label: "Uptime" },
                { value: "24/7", label: "Support" },
                { value: "$199", label: "Starting/yr" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-xl md:text-2xl font-bold text-foreground font-mono">{stat.value}</span>
                  <span className="mt-0.5 text-[10px] md:text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Live Map (Always Visible) */}
          <div className="relative flex flex-col gap-3 md:gap-4">
            {/* Demo Label */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 md:gap-2 rounded-full border border-primary/30 bg-primary/10 px-2 md:px-3 py-1">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-semibold text-primary">LIVE DEMO</span>
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">
                  Real-time Fleet Tracking
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                <Navigation className="w-3 h-3 text-primary" />
                {activeCount}/{totalCount} active
              </div>
            </div>

            {/* Map Container - Always Visible */}
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
              {/* Map */}
              <div ref={containerRef} className="absolute inset-0 z-0" />
              
              {/* Floating Lead Form - Responsive positioning */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-52 sm:w-64">
                {!hasSubmittedLead ? (
                  <LeadCaptureForm onSubmit={(email) => {
                      setHasSubmittedLead(true)
                      if (onAccessGranted) onAccessGranted(email)
                    }} />
                ) : (
                  <div className="bg-card/90 border border-border rounded-xl md:rounded-2xl p-2 sm:p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] sm:text-xs text-foreground">Demo unlocked!</p>
                    </div>
                    <a 
                      href="/driver" 
                      target="_blank"
                      className="mt-2 block w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-primary/10 text-primary text-[10px] sm:text-xs font-medium text-center hover:bg-primary/20 active:scale-95 transition-all"
                    >
                      Open Driver App
                    </a>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {vehicles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
                  <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-card/80 backdrop-blur-sm border border-border max-w-xs">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
                      <Navigation className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm md:text-base">Waiting for vehicles...</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Open /driver on your phone to start
                    </p>
                  </div>
                </div>
              )}

              {/* Stats Overlay */}
              {vehicles.length > 0 && (
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 flex gap-1.5 sm:gap-2">
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Vehicles</p>
                    <p className="text-sm sm:text-lg font-bold text-foreground">{totalCount}</p>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">Active</p>
                    <p className="text-sm sm:text-lg font-bold text-green-500">{activeCount}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center">
              This is a working demo. Vehicles update in real-time every 2 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
